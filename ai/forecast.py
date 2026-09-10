import os
import pandas as pd
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), "sample_data.csv")

class DemandForecaster:
    def __init__(self):
        self.data = None
        self._load_data()

    def _load_data(self):
        try:
            if os.path.exists(DATA_PATH):
                self.data = pd.read_csv(DATA_PATH)
            else:
                self.data = pd.DataFrame({
                    "service": ["Plumber", "Electrician", "Carpenter", "Cleaner", "Painter", "Appliance Repair"],
                    "historical_bookings": [12, 10, 8, 15, 6, 9],
                    "emergency_requests": [2, 3, 1, 0, 0, 2],
                    "demand_level": ["HIGH", "HIGH", "MEDIUM", "HIGH", "LOW", "MEDIUM"]
                })
        except Exception as e:
            print(f"[Forecaster] Warning loading dataset: {e}")

    def predict_demand(self, service: str, locality: str, day_of_week: str = "Monday", hour: int = 10, is_emergency: bool = False):
        service_clean = service.strip().title()
        locality_clean = locality.strip().title() if locality else "Kothrud"
        
        # Calculate baseline metrics
        if self.data is not None and not self.data.empty:
            subset = self.data[self.data['service'].str.lower() == service_clean.lower()]
            if subset.empty:
                subset = self.data
            
            loc_subset = subset[subset['locality'].str.lower().str.contains(locality_clean.lower(), na=False)]
            active_subset = loc_subset if not loc_subset.empty else subset

            avg_bookings = float(active_subset['historical_bookings'].mean())
            avg_emergencies = float(active_subset['emergency_requests'].mean())
        else:
            avg_bookings = 10.0
            avg_emergencies = 2.0

        # Adjust for peak hours (09:00 - 12:00 and 17:00 - 20:00)
        is_peak_hour = (8 <= hour <= 12) or (17 <= hour <= 21)
        peak_multiplier = 1.35 if is_peak_hour else 0.85

        estimated_volume = int(np.round(avg_bookings * peak_multiplier))
        estimated_emergencies = int(np.round(avg_emergencies * (1.5 if is_emergency else 1.0)))

        # Determine categorical demand level
        if estimated_volume >= 12 or is_emergency or estimated_emergencies >= 3:
            demand_level = "HIGH"
            confidence = 0.92
            color_hint = "rose"
        elif estimated_volume >= 6:
            demand_level = "MEDIUM"
            confidence = 0.87
            color_hint = "amber"
        else:
            demand_level = "LOW"
            confidence = 0.81
            color_hint = "emerald"

        return {
            "service": service_clean,
            "locality": locality_clean,
            "day_of_week": day_of_week,
            "hour_of_day": hour,
            "demand_level": demand_level,
            "estimated_volume_index": estimated_volume,
            "expected_emergency_rate": estimated_emergencies,
            "is_peak_window": is_peak_hour,
            "confidence_score": confidence,
            "color_hint": color_hint,
            "summary": f"Predicted {demand_level} demand for {service_clean} in {locality_clean} during {'peak' if is_peak_hour else 'regular'} hours."
        }

forecaster = DemandForecaster()
