//Sample SQL for Patient table

INSERT INTO "PatientRecords"."Patient"
("PatientId", "FirstName", "LastName", "DateOfBirth", "AddressLine1", "AddressLine2", "City", "State", "Zip", "ClinicId")
VALUES
( 2, 'Fred', 'Smith', '1968-03-14', '1218 Ashley Lake Dr','','Marietta','GA','30062’,1)


UPDATE "PatientRecords"."Patient"
SET "LastName" = 'Smith'
WHERE "LastName" = 'Sollicito'


SELECT * FROM "PatientRecords"."Patient", "PatientRecords"."Clinic"
 WHERE "PatientRecords"."Patient"."ClinicId" = "PatientRecords"."Clinic"."ClinicId"


DELETE FROM "PatientRecords"."Patient" WHERE FirstName= "Michelle"


//Do NOT use this unless you need to delete the table!
DROP TABLE "PatientRecords"."Patient"