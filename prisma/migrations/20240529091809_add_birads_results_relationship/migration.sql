-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "change_password_secret_key" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dicom_metadata" (
    "mammography_id" TEXT NOT NULL,
    "patient_name" TEXT,
    "patient_id" TEXT NOT NULL,
    "acquisition_date" TEXT,
    "acquisition_time" TEXT,
    "view" TEXT,
    "laterality" TEXT,
    "implant" TEXT,
    "manufacturer" TEXT,
    "manufacturer_model" TEXT,
    "institution" TEXT,

    CONSTRAINT "dicom_metadata_pk" PRIMARY KEY ("mammography_id")
);

-- CreateTable
CREATE TABLE "birads_results" (
    "study_uid" TEXT NOT NULL,
    "model_1_result" DECIMAL NOT NULL,
    "patient_name" VARCHAR(255),
    "id" SERIAL NOT NULL,

    CONSTRAINT "birads_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "birads_results_study_uid_key" ON "birads_results"("study_uid");

-- AddForeignKey
ALTER TABLE "dicom_metadata" ADD CONSTRAINT "dicom_metadata_mammography_id_fkey" FOREIGN KEY ("mammography_id") REFERENCES "birads_results"("study_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
