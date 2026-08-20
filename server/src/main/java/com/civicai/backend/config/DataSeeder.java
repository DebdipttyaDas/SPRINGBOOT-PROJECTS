package com.civicai.backend.config;

import com.civicai.backend.entity.CivicIssue;
import com.civicai.backend.repository.CivicIssueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedIssues(CivicIssueRepository issueRepository) {
        return args -> {
            if (issueRepository.count() == 0) {
                CivicIssue issue1 = CivicIssue.builder()
                        .title("Deep Crater Pothole on Outer Ring Road under Flyover")
                        .description("Dangerous 2-foot wide pothole causing severe traffic bottleneck. A two-wheeler skidded yesterday night. Immediate asphalt recarpeting needed.")
                        .category("POTHOLE")
                        .urgency("CRITICAL")
                        .aiConfidence(0.96)
                        .aiReasoning("High-depth road fracture (depth >18cm) located in fast-moving traffic lane. Imminent vehicle axle damage & fatal two-wheeler crash hazard.")
                        .detectedHazards("Two-Wheeler Fatal Skid Risk, Peak-Hour Traffic Choke, Water Infiltration")
                        .latitude(12.9268)
                        .longitude(77.6762)
                        .address("Near EcoSpace Business Park, Bellandur Outer Ring Rd, Bengaluru")
                        .wardNumber("Ward 150 - Bellandur")
                        .wardOfficeName("Bellandur Tech Corridor (Mahadevapura Zone)")
                        .wardOfficerEmail("ward150.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 11201")
                        .imageUrl("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80")
                        .status("IN_PROGRESS")
                        .citizenName("Aravind Swaminathan")
                        .citizenPhone("+91 98765 43210")
                        .citizenEmail("aravind.s@gmail.com")
                        .createdAt(LocalDateTime.now().minusHours(8))
                        .upvotes(34)
                        .build();

                CivicIssue issue2 = CivicIssue.builder()
                        .title("Unauthorized 5-Story Commercial Structure Encroaching Storm Drain")
                        .description("Builder constructing RCC pillars directly over the stormwater drain buffer zone without BBMP sanctioned plan or setback.")
                        .category("ILLEGAL_CONSTRUCTION")
                        .urgency("CRITICAL")
                        .aiConfidence(0.94)
                        .aiReasoning("AI Spatial Geometry detected structural encroachment over a primary municipal stormwater canal (SWD). Violates buffer zone norms by 12 meters.")
                        .detectedHazards("Severe Urban Flooding Risk, Public Right-of-Way Obstruction, Structural Collapse")
                        .latitude(12.9145)
                        .longitude(77.6498)
                        .address("Sector 2, 19th Main, HSR Layout, Bengaluru")
                        .wardNumber("Ward 174 - HSR Layout")
                        .wardOfficeName("HSR Layout & Silk Board (Bommanahalli Zone)")
                        .wardOfficerEmail("ward174.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 22302")
                        .imageUrl("https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1000&q=80")
                        .status("IN_REVIEW")
                        .citizenName("Priya Venkatesh")
                        .citizenPhone("+91 98123 45678")
                        .citizenEmail("priya.v@outlook.com")
                        .createdAt(LocalDateTime.now().minusHours(18))
                        .upvotes(52)
                        .build();

                CivicIssue issue3 = CivicIssue.builder()
                        .title("Severe Monsoon Waterlogging and Submerged Footpaths")
                        .description("Rainwater accumulated up to 1.5 feet. Catch-pits are completely choked with plastic waste. Vehicles stalling.")
                        .category("WATERLOGGING")
                        .urgency("CRITICAL")
                        .aiConfidence(0.97)
                        .aiReasoning("Standing water inundation level ~350mm detected across 120m roadway span. Silt-traps 100% occluded.")
                        .detectedHazards("Electrical Short-Circuit Risk, Dengue/Malaria Vector, Pedestrian Drowning Risk")
                        .latitude(12.9348)
                        .longitude(77.6212)
                        .address("80 Feet Road, 4th Block, Koramangala, Bengaluru")
                        .wardNumber("Ward 151 - Koramangala")
                        .wardOfficeName("Koramangala Central (South Zone)")
                        .wardOfficerEmail("ward151.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 33403")
                        .imageUrl("https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80")
                        .status("ASSIGNED")
                        .citizenName("Rohan Das")
                        .citizenPhone("+91 99001 22334")
                        .citizenEmail("rohan.das@techmail.com")
                        .createdAt(LocalDateTime.now().minusHours(3))
                        .upvotes(21)
                        .build();

                CivicIssue issue4 = CivicIssue.builder()
                        .title("Massive Illegal Garbage Dump & Open Burning on Vacant Plot")
                        .description("Mixed municipal solid waste dumped over 400 sqft area. Smoldering plastic fumes creating hazardous air quality.")
                        .category("GARBAGE_DUMP")
                        .urgency("HIGH")
                        .aiConfidence(0.92)
                        .aiReasoning("Unsegregated bio-hazardous and plastic waste accumulation. Thermal signature indicates active low-temperature toxic incineration.")
                        .detectedHazards("Toxic Dioxin Inhalation, Stray Canine Infestation, Groundwater Leaching")
                        .latitude(12.9734)
                        .longitude(77.6438)
                        .address("12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru")
                        .wardNumber("Ward 112 - Indiranagar")
                        .wardOfficeName("Indiranagar & Domlur (East Zone)")
                        .wardOfficerEmail("ward112.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 44504")
                        .imageUrl("https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80")
                        .status("RESOLVED")
                        .citizenName("Dr. Vikram Malhotra")
                        .citizenPhone("+91 98332 11099")
                        .citizenEmail("vikram.m@hospital.org")
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .resolvedAt(LocalDateTime.now().minusHours(5))
                        .resolvedImageUrl("https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80")
                        .upvotes(45)
                        .build();

                CivicIssue issue5 = CivicIssue.builder()
                        .title("Fallen Gulmohar Tree Blocking Both Lanes & Snapped Live Cable")
                        .description("Uprooted heavy tree fallen across road after heavy wind. Dangling overhead power line sparking on wet tarmac.")
                        .category("FALLEN_TREE")
                        .urgency("CRITICAL")
                        .aiConfidence(0.99)
                        .aiReasoning("Full-span botanical roadway obstruction (>50cm trunk caliper) with entangled 440V distribution feeder.")
                        .detectedHazards("High-Voltage Electrocution Risk, Complete Arterial Transit Blockade")
                        .latitude(12.9772)
                        .longitude(77.6085)
                        .address("Residency Road, near Brigade Junction, CBD, Bengaluru")
                        .wardNumber("Ward 110 - MG Road & CBD")
                        .wardOfficeName("Central Business District (Central Zone)")
                        .wardOfficerEmail("ward110.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 55605")
                        .imageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80")
                        .status("IN_PROGRESS")
                        .citizenName("Sneha Kulkarni")
                        .citizenPhone("+91 97400 99887")
                        .citizenEmail("sneha.k@lawfirm.in")
                        .createdAt(LocalDateTime.now().minusHours(1))
                        .upvotes(67)
                        .build();

                CivicIssue issue6 = CivicIssue.builder()
                        .title("Exposed Live Wiring on Damaged Streetlight Pole")
                        .description("Vehicle collision bent the streetlight pole base, leaving 230V live wire junction open to pedestrians.")
                        .category("STREETLIGHT_DAMAGE")
                        .urgency("CRITICAL")
                        .aiConfidence(0.95)
                        .aiReasoning("Exposed electrical terminal at ground level near school walking pathway.")
                        .detectedHazards("Pedestrian Electrocution, Structural Tip-Over Risk")
                        .latitude(12.8425)
                        .longitude(77.6795)
                        .address("Neeladri Road, Phase 1, Electronic City, Bengaluru")
                        .wardNumber("Ward 192 - Electronic City")
                        .wardOfficeName("Electronic City Phase 1 & 2 (Anekal - ELCITA Zone)")
                        .wardOfficerEmail("ward192.officer@civic-gov.org")
                        .wardOfficerPhone("+91 98450 66706")
                        .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80")
                        .status("REPORTED")
                        .citizenName("Karthik Raman")
                        .citizenPhone("+91 98440 33211")
                        .citizenEmail("karthik.r@infosys.com")
                        .createdAt(LocalDateTime.now().minusMinutes(40))
                        .upvotes(18)
                        .build();

                issueRepository.saveAll(Arrays.asList(issue1, issue2, issue3, issue4, issue5, issue6));
            }
        };
    }
}
