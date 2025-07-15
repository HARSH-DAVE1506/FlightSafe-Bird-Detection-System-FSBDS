def estimate_risk(species_list, num_birds, bbox_sizes):
    risk_levels = []
    for (specie, conf), size in zip(species_list, bbox_sizes):
        if size > 50000 or specie in ["Hawk", "Eagle"]:
            risk_levels.append("High")
        elif size > 20000:
            risk_levels.append("Moderate")
        else:
            risk_levels.append("Low")

    # Overall risk
    if num_birds > 5 or "High" in risk_levels:
        overall_risk = "High"
    elif num_birds > 3:
        overall_risk = "Moderate"
    else:
        overall_risk = "Low"

    return overall_risk, risk_levels

