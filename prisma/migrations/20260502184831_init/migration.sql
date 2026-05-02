-- CreateTable
CREATE TABLE "doctors" (
    "license_number" VARCHAR(5) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("license_number")
);

-- CreateTable
CREATE TABLE "patients" (
    "id_number" VARCHAR(9) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id_number")
);

-- CreateTable
CREATE TABLE "appointments" (
    "appointment_number" SERIAL NOT NULL,
    "appointment_date" TIMESTAMPTZ(6) NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "doctor_license" VARCHAR(5) NOT NULL,
    "patient_id" VARCHAR(9) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("appointment_number")
);

-- CreateIndex
CREATE INDEX "appointments_doctor_license_appointment_date_idx" ON "appointments"("doctor_license", "appointment_date");

-- CreateIndex
CREATE INDEX "appointments_patient_id_appointment_date_idx" ON "appointments"("patient_id", "appointment_date");

-- CreateIndex
CREATE INDEX "appointments_appointment_date_idx" ON "appointments"("appointment_date");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_license_fkey" FOREIGN KEY ("doctor_license") REFERENCES "doctors"("license_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id_number") ON DELETE RESTRICT ON UPDATE CASCADE;
