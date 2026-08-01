-- Sample data across all core modules for demo/testing purposes.
-- Uses fixed UUIDs so related tables (shipments, invoices, seal_events, etc.)
-- can reference the same customers/vehicles/drivers/routes consistently.

-- CUSTOMERS
insert into customers (id, name, contact_person, email, phone, address, tax_id, credit_limit, payment_terms, is_active) values
('b73b040c-146d-414b-b433-34190b99f7d6','Al-Falah Trading Co.','Nadeem Qureshi','nadeem@alfalahtrading.pk','+92 21 3456 7890','Plot 45, Sector 22, Korangi Industrial Area, Karachi','NTN-1234567-8',5000000,'Net 30',true),
('f4813b01-8b79-476e-8dea-b01a0de29eaa','Sindh Textile Mills Ltd','Farah Aslam','farah@sindhtextile.pk','+92 21 3567 8901','SITE Area, Manghopir Road, Karachi','NTN-2345678-9',8000000,'Net 45',true),
('d5e9d096-62f8-4379-9711-2ce863f9b3df','Punjab Agro Exports','Waseem Akram','waseem@punjabagro.pk','+92 42 3789 0123','23-C, Gulberg III, Lahore','NTN-3456789-0',3500000,'Net 30',true),
('f9a2a78a-9082-47d6-beea-b4d102b67e79','Frontier Traders (Pvt) Ltd','Zubair Khan','zubair@frontiertraders.pk','+92 91 5678 9012','Ring Road, Peshawar','NTN-4567890-1',2000000,'Net 15',true),
('e2513080-14a7-4a73-947c-ca8d3bb8e305','Balochistan Minerals Corp','Ayesha Baloch','ayesha@balochminerals.pk','+92 81 2890 1234','Airport Road, Quetta','NTN-5678901-2',6000000,'Net 60',true),
('a80c8ac2-a1ba-47e4-be07-a6df05e64d92','National Logistics Partners','Hamid Raza','hamid@nlpartners.pk','+92 51 2345 6789','Blue Area, Islamabad','NTN-6789012-3',4500000,'Net 30',false)
on conflict (id) do nothing;

-- CONTRACTS
insert into contracts (id, customer_id, start_date, end_date, status, terms_conditions, rates_json) values
('87d9106d-b0d7-49cb-89a6-0c6b0e9823fc','b73b040c-146d-414b-b433-34190b99f7d6','2026-01-01','2026-12-31','active','Standard road freight terms, fuel surcharge applies.','{"per_km_rate": 85, "currency": "PKR"}'),
('acc95ebe-f0e9-48b1-b62c-4e0c700244ce','f4813b01-8b79-476e-8dea-b01a0de29eaa','2026-02-01','2027-01-31','active','Bulk textile transport, monthly billing.','{"per_km_rate": 90, "currency": "PKR"}'),
('4b8c4f61-a26a-446e-9bff-317c6fa37b77','d5e9d096-62f8-4379-9711-2ce863f9b3df','2026-03-01','2026-11-30','active','Seasonal agro export contract.','{"per_km_rate": 80, "currency": "PKR"}'),
('77fe2154-a9c0-4bd4-90c6-fc0621727239','f9a2a78a-9082-47d6-beea-b4d102b67e79','2025-01-01','2025-12-31','expired','Renewed annually, pending renewal.','{"per_km_rate": 75, "currency": "PKR"}')
on conflict (id) do nothing;

-- VEHICLES
insert into vehicles (id, registration_number, type, capacity_weight, capacity_volume, status, fitness_expiry, insurance_expiry) values
('c63487f4-8a7e-445a-bc47-2f1a254a642d','LEA-2024','Truck',20,40,'available','2026-11-15','2026-09-30'),
('e79e198a-0c7b-406c-93fe-c02d04e1aebd','KHI-3391','Container Truck',25,50,'in_transit','2027-01-20','2026-12-10'),
('d6eb55ae-3f43-4c33-bba6-abc6554c77a9','LHR-7712','Trailer',30,60,'available','2026-10-05','2026-08-25'),
('9e6c4d61-bbcd-4a41-b15b-9b7239c87253','PES-4456','Truck',15,30,'maintenance','2026-06-01','2026-07-15'),
('1ba5d941-dff9-4d70-bc15-eb3b6c2487a4','QTA-1189','Truck',18,35,'available','2027-02-28','2027-01-05'),
('8c51a969-7d54-4432-9030-295b033b0283','ISB-5523','Container Truck',22,45,'in_transit','2026-12-31','2026-11-20')
on conflict (id) do nothing;

-- DRIVERS
insert into drivers (id, full_name, license_number, license_expiry, phone, status) values
('4c1fd9c6-de91-4862-ae8b-d6f14ac2783f','Muhammad Aslam','LHR-DL-88213','2027-03-15','+92 300 1234567','available'),
('d960e307-9248-4c22-ade8-30446d190734','Imran Sheikh','KHI-DL-55021','2026-12-01','+92 301 2345678','driving'),
('59fe9d75-1bd2-4b4b-b560-2c2aab2ea81c','Bilal Hussain','PES-DL-33012','2027-06-20','+92 302 3456789','available'),
('b4971a1c-e455-4e59-bf87-31ea1b183284','Tariq Mehmood','QTA-DL-19087','2026-09-10','+92 303 4567890','on_leave'),
('f27149a6-b9ea-47ca-b974-6ef342cb9ff8','Sana Ullah','ISB-DL-44521','2027-01-28','+92 304 5678901','driving'),
('b2707fff-a2f5-4446-9d08-b6daab2f65ac','Rashid Nawaz','LHR-DL-91234','2026-08-05','+92 305 6789012','available')
on conflict (id) do nothing;

-- ROUTES
insert into routes (id, name, origin_name, destination_name, distance_km, checkpoints_json, approved_corridors_json) values
('a04694e6-55cb-44a8-a24c-0a0c1c5e58ee','Karachi - Lahore (N-5)','Karachi','Lahore',1220,'["Hyderabad","Sukkur","Multan"]','["N-5 National Highway"]'),
('d26c4695-e674-43e3-bb3e-0bd2fd1a2f34','Karachi - Peshawar','Karachi','Peshawar',1700,'["Hyderabad","Sukkur","Multan","Lahore","Islamabad"]','["N-5", "M-1"]'),
('de908c90-db87-477f-80e1-7ca67ce6cff9','Torkham Border Transit','Peshawar','Torkham',55,'["Jamrud"]','["Peshawar-Torkham Road"]'),
('b3bf6e68-667e-4914-a64e-e46cb5caa094','Chaman Border Transit','Quetta','Chaman',130,'["Qila Abdullah"]','["N-25"]'),
('d869a3b9-a17c-4ebb-a2dc-b04bf4a56d01','Gwadar - Quetta (CPEC)','Gwadar','Quetta',600,'["Turbat","Panjgur"]','["N-85 CPEC Route"]'),
('1de6a61a-f469-409b-a24e-6e680d9612b8','Karachi Port - Multan Dry Port','Karachi','Multan',950,'["Hyderabad","Sukkur"]','["N-5"]')
on conflict (id) do nothing;

-- SHIPMENTS
insert into shipments (id, shipment_id, customer_id, contract_id, origin, destination, route_id, commodity, hs_code, weight, packages, container_number, vehicle_id, driver_id, eta, etd, pld, incoterms, insurance_policy, status) values
('13fe642b-5ad3-4802-9b01-edd5ee71e0a1','TRK-2026-001','b73b040c-146d-414b-b433-34190b99f7d6','87d9106d-b0d7-49cb-89a6-0c6b0e9823fc','Karachi','Lahore','a04694e6-55cb-44a8-a24c-0a0c1c5e58ee','Textile Fabric Rolls','520811',18000,450,null,'c63487f4-8a7e-445a-bc47-2f1a254a642d','4c1fd9c6-de91-4862-ae8b-d6f14ac2783f','2026-08-05T10:00:00Z','2026-08-02T08:00:00Z','2026-08-05T14:00:00Z','FOB','POL-88213-2026','pending'),
('78ffec43-5a7e-443c-80a3-19ba6ae07830','TRK-2026-002','f4813b01-8b79-476e-8dea-b01a0de29eaa','acc95ebe-f0e9-48b1-b62c-4e0c700244ce','Karachi','Peshawar','d26c4695-e674-43e3-bb3e-0bd2fd1a2f34','Cotton Yarn Bales','520512',22000,600,'MSCU7712345','e79e198a-0c7b-406c-93fe-c02d04e1aebd','d960e307-9248-4c22-ade8-30446d190734','2026-08-10T12:00:00Z','2026-08-06T07:00:00Z','2026-08-10T16:00:00Z','CIF','POL-55021-2026','approved'),
('b31adaf6-403b-40a3-9896-ebb890cc7d07','TRK-2026-003','d5e9d096-62f8-4379-9711-2ce863f9b3df','4b8c4f61-a26a-446e-9bff-317c6fa37b77','Lahore','Torkham','de908c90-db87-477f-80e1-7ca67ce6cff9','Rice (Basmati) Export','100630',15000,300,null,'d6eb55ae-3f43-4c33-bba6-abc6554c77a9','59fe9d75-1bd2-4b4b-b560-2c2aab2ea81c','2026-08-03T09:00:00Z','2026-08-01T06:00:00Z','2026-08-03T12:00:00Z','FOB','POL-33012-2026','in_transit'),
('0e3676d4-5a6a-4f67-be53-7427c3e0adcb','TRK-2026-004','f9a2a78a-9082-47d6-beea-b4d102b67e79','77fe2154-a9c0-4bd4-90c6-fc0621727239','Peshawar','Torkham','de908c90-db87-477f-80e1-7ca67ce6cff9','Dry Fruits Consignment','080232',8000,200,null,'9e6c4d61-bbcd-4a41-b15b-9b7239c87253','b4971a1c-e455-4e59-bf87-31ea1b183284','2026-07-30T09:00:00Z','2026-07-28T06:00:00Z','2026-07-30T11:00:00Z','FOB','POL-19087-2026','customs_hold'),
('ee98c10b-2248-4fbd-bae8-b4840c20c0ed','TRK-2026-005','e2513080-14a7-4a73-947c-ca8d3bb8e305',null,'Gwadar','Quetta','d869a3b9-a17c-4ebb-a2dc-b04bf4a56d01','Marble Blocks','251611',30000,50,null,'1ba5d941-dff9-4d70-bc15-eb3b6c2487a4','f27149a6-b9ea-47ca-b974-6ef342cb9ff8','2026-07-25T15:00:00Z','2026-07-23T05:00:00Z','2026-07-25T18:00:00Z','EXW','POL-44521-2026','cleared'),
('121edcf3-0abd-4405-8dbf-d7c204fa15be','TRK-2026-006','a80c8ac2-a1ba-47e4-be07-a6df05e64d92',null,'Karachi','Multan','1de6a61a-f469-409b-a24e-6e680d9612b8','Machinery Parts','845981',12000,80,'TCLU9982341','8c51a969-7d54-4432-9030-295b033b0283','b2707fff-a2f5-4446-9d08-b6daab2f65ac','2026-07-18T10:00:00Z','2026-07-16T06:00:00Z','2026-07-18T13:00:00Z','CIF','POL-91234-2026','delivered'),
('ad144b97-2a71-4349-afed-820a5e86c086','TRK-2026-007','b73b040c-146d-414b-b433-34190b99f7d6','87d9106d-b0d7-49cb-89a6-0c6b0e9823fc','Karachi','Lahore','a04694e6-55cb-44a8-a24c-0a0c1c5e58ee','Garment Consignment','620342',9000,350,null,'e79e198a-0c7b-406c-93fe-c02d04e1aebd','d960e307-9248-4c22-ade8-30446d190734','2026-08-12T10:00:00Z','2026-08-09T08:00:00Z','2026-08-12T14:00:00Z','FOB','POL-55021-2026B','in_transit'),
('8afe7639-827d-4d22-abb7-26f9c2bdb94d','TRK-2026-008','d5e9d096-62f8-4379-9711-2ce863f9b3df','4b8c4f61-a26a-446e-9bff-317c6fa37b77','Lahore','Karachi','a04694e6-55cb-44a8-a24c-0a0c1c5e58ee','Citrus Fruit Export','080550',10000,400,null,'d6eb55ae-3f43-4c33-bba6-abc6554c77a9','59fe9d75-1bd2-4b4b-b560-2c2aab2ea81c','2026-07-10T09:00:00Z','2026-07-08T06:00:00Z','2026-07-10T12:00:00Z','FOB','POL-33012-2026B','cancelled')
on conflict (id) do nothing;

-- SHIPMENT DOCUMENTS
insert into shipment_documents (shipment_id, type, document_number, file_url, expiry_date, status) values
('13fe642b-5ad3-4802-9b01-edd5ee71e0a1','gd','GD-2026-00145','https://example.com/docs/gd-00145.pdf',null,'pending'),
('78ffec43-5a7e-443c-80a3-19ba6ae07830','invoice','INV-2026-00212','https://example.com/docs/inv-00212.pdf',null,'approved'),
('b31adaf6-403b-40a3-9896-ebb890cc7d07','permit','PERM-2026-00033','https://example.com/docs/perm-00033.pdf','2026-09-01','approved'),
('0e3676d4-5a6a-4f67-be53-7427c3e0adcb','gd','GD-2026-00146','https://example.com/docs/gd-00146.pdf',null,'rejected'),
('121edcf3-0abd-4405-8dbf-d7c204fa15be','packing_list','PL-2026-00088','https://example.com/docs/pl-00088.pdf',null,'approved')
on conflict do nothing;

-- SEALS
insert into seals (id, seal_number, type, status) values
('1e49f552-171a-4ae4-b634-65c34ffd2d3d','SL-100234','electronic','applied'),
('d491cb25-9f27-467e-bf3c-b77dfcfae6f1','SL-100235','electronic','applied'),
('3c620b28-5beb-489a-8cd0-35630fe52ed7','SL-100236','mechanical','available'),
('f545fea2-3372-4f86-8b85-f3fe79dbcbfe','SL-100237','mechanical','available'),
('4aa875df-064d-4978-91b3-1541e5e0cc90','SL-100238','electronic','broken'),
('c28b4ba3-d116-4df6-a975-ccc5520fafb7','SL-100239','electronic','applied')
on conflict (id) do nothing;

-- SEAL EVENTS
insert into seal_events (seal_id, shipment_id, event_type, location, description, occurred_at) values
('1e49f552-171a-4ae4-b634-65c34ffd2d3d','b31adaf6-403b-40a3-9896-ebb890cc7d07','applied','Lahore Depot','Seal applied before departure','2026-08-01T06:15:00Z'),
('1e49f552-171a-4ae4-b634-65c34ffd2d3d','b31adaf6-403b-40a3-9896-ebb890cc7d07','verified','Peshawar Checkpoint','Seal verified intact at checkpoint','2026-08-02T14:00:00Z'),
('d491cb25-9f27-467e-bf3c-b77dfcfae6f1','ad144b97-2a71-4349-afed-820a5e86c086','applied','Karachi Port','Seal applied before departure','2026-08-09T08:15:00Z'),
('4aa875df-064d-4978-91b3-1541e5e0cc90','0e3676d4-5a6a-4f67-be53-7427c3e0adcb','tampered','Torkham Border','Seal found broken during customs inspection','2026-07-30T10:30:00Z')
on conflict do nothing;

-- INCIDENTS
insert into incidents (shipment_id, type, severity, description, status, resolution_notes) values
('0e3676d4-5a6a-4f67-be53-7427c3e0adcb','delay','high','Consignment held at Torkham due to seal tampering investigation.','open',null),
('8afe7639-827d-4d22-abb7-26f9c2bdb94d','route_deviation','medium','Vehicle deviated from approved corridor near Sukkur.','resolved','Driver counseled, route corrected within 2 hours.')
on conflict do nothing;

-- INVOICES
insert into invoices (id, shipment_id, customer_id, amount, status, due_date, items_json) values
('168dd71d-571f-4456-a074-8d1c88bcbaa7','78ffec43-5a7e-443c-80a3-19ba6ae07830','f4813b01-8b79-476e-8dea-b01a0de29eaa',285000,'issued','2026-09-15','[{"desc":"Freight - Karachi to Peshawar","amount":250000},{"desc":"Fuel surcharge","amount":35000}]'),
('100dd333-7d0e-40aa-bd1c-47e3e2207261','b31adaf6-403b-40a3-9896-ebb890cc7d07','d5e9d096-62f8-4379-9711-2ce863f9b3df',195000,'paid','2026-08-20','[{"desc":"Freight - Lahore to Torkham","amount":175000},{"desc":"Handling","amount":20000}]'),
('096a1bcc-c551-4f69-bdf4-a46c0c65918f','121edcf3-0abd-4405-8dbf-d7c204fa15be','a80c8ac2-a1ba-47e4-be07-a6df05e64d92',310000,'overdue','2026-07-25','[{"desc":"Freight - Karachi to Multan","amount":280000},{"desc":"Documentation","amount":30000}]'),
('7a60b68d-e6a4-4aff-8932-dd9ac850d763','ee98c10b-2248-4fbd-bae8-b4840c20c0ed','e2513080-14a7-4a73-947c-ca8d3bb8e305',420000,'draft','2026-09-05','[{"desc":"Freight - Gwadar to Quetta","amount":400000},{"desc":"Loading/Unloading","amount":20000}]'),
('200aa206-b728-4d62-a1c4-cb617a8fd388','13fe642b-5ad3-4802-9b01-edd5ee71e0a1','b73b040c-146d-414b-b433-34190b99f7d6',260000,'draft','2026-09-10','[{"desc":"Freight - Karachi to Lahore","amount":230000},{"desc":"Fuel surcharge","amount":30000}]')
on conflict (id) do nothing;
