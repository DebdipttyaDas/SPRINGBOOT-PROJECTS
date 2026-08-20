package com.civicai.backend.service;

import com.civicai.backend.entity.CivicWard;
import com.civicai.backend.repository.CivicWardRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WardRoutingService {

    @Autowired
    private CivicWardRepository wardRepository;

    @PostConstruct
    public void initWards() {
        if (wardRepository.count() == 0) {
            List<CivicWard> defaultWards = new ArrayList<>();

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 150 - Bellandur")
                    .wardName("Bellandur Tech Corridor")
                    .zoneName("Mahadevapura Zone")
                    .officerName("Er. Rajesh Kumar")
                    .officerEmail("ward150.officer@civic-gov.org")
                    .officerPhone("+91 98450 11201")
                    .officeAddress("BBMP Ward Office, Green Glen Layout, Bellandur, Bengaluru 560103")
                    .centerLat(12.9250)
                    .centerLng(77.6750)
                    .radiusKm(4.5)
                    .build());

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 174 - HSR Layout")
                    .wardName("HSR Layout & Silk Board")
                    .zoneName("Bommanahalli Zone")
                    .officerName("Smt. Ananya Sen")
                    .officerEmail("ward174.officer@civic-gov.org")
                    .officerPhone("+91 98450 22302")
                    .officeAddress("Municipal Corporation Office, 27th Main Rd, Sector 1, HSR Layout, Bengaluru 560102")
                    .centerLat(12.9121)
                    .centerLng(77.6446)
                    .radiusKm(3.8)
                    .build());

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 151 - Koramangala")
                    .wardName("Koramangala Central")
                    .zoneName("South Zone")
                    .officerName("Shri Vikramaditya Rao")
                    .officerEmail("ward151.officer@civic-gov.org")
                    .officerPhone("+91 98450 33403")
                    .officeAddress("Civic Utility Complex, 80 Feet Rd, 4th Block, Koramangala, Bengaluru 560034")
                    .centerLat(12.9352)
                    .centerLng(77.6245)
                    .radiusKm(3.2)
                    .build());

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 112 - Indiranagar")
                    .wardName("Indiranagar & Domlur")
                    .zoneName("East Zone")
                    .officerName("Er. Kavita Hegde")
                    .officerEmail("ward112.officer@civic-gov.org")
                    .officerPhone("+91 98450 44504")
                    .officeAddress("Ward 112 HQ, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038")
                    .centerLat(12.9719)
                    .centerLng(77.6412)
                    .radiusKm(3.0)
                    .build());

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 110 - MG Road & CBD")
                    .wardName("Central Business District")
                    .zoneName("Central Zone")
                    .officerName("Shri Suresh Menon")
                    .officerEmail("ward110.officer@civic-gov.org")
                    .officerPhone("+91 98450 55605")
                    .officeAddress("Town Hall Annexe, JC Road, Central Bengaluru 560002")
                    .centerLat(12.9756)
                    .centerLng(77.6066)
                    .radiusKm(3.5)
                    .build());

            defaultWards.add(CivicWard.builder()
                    .wardNumber("Ward 192 - Electronic City")
                    .wardName("Electronic City Phase 1 & 2")
                    .zoneName("Anekal - ELCITA Zone")
                    .officerName("Er. Deepa Nair")
                    .officerEmail("ward192.officer@civic-gov.org")
                    .officerPhone("+91 98450 66706")
                    .officeAddress("ELCITA Administrative Building, West Phase, Electronic City, Bengaluru 560100")
                    .centerLat(12.8399)
                    .centerLng(77.6770)
                    .radiusKm(5.0)
                    .build());

            wardRepository.saveAll(defaultWards);
        }
    }

    /**
     * Finds the closest municipal ward based on Great-Circle Haversine distance
     */
    public CivicWard routeToClosestWard(double lat, double lng) {
        List<CivicWard> wards = wardRepository.findAll();
        if (wards.isEmpty()) {
            return null;
        }

        CivicWard closest = wards.get(0);
        double minDistance = calculateDistanceKm(lat, lng, closest.getCenterLat(), closest.getCenterLng());

        for (CivicWard ward : wards) {
            if (ward.getCenterLat() != null && ward.getCenterLng() != null) {
                double dist = calculateDistanceKm(lat, lng, ward.getCenterLat(), ward.getCenterLng());
                if (dist < minDistance) {
                    minDistance = dist;
                    closest = ward;
                }
            }
        }
        return closest;
    }

    public List<CivicWard> getAllWards() {
        return wardRepository.findAll();
    }

    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c; // Earth radius in KM
    }
}
