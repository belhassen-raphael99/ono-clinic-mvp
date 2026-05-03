import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Compute the 9th check digit for an 8-digit base, producing a valid
 * Israeli Teudat Zehut. Must satisfy the same Luhn-variant algorithm
 * as src/lib/validators/teudat-zehut.ts (which the test suite verifies).
 */
function generateTeudatZehut(base8: string): string {
  if (!/^\d{8}$/.test(base8)) {
    throw new Error(`base must be 8 digits, got: ${base8}`);
  }
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    let digit = Number(base8[i]);
    digit *= (i % 2) + 1;
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return base8 + String(checkDigit);
}

// ─────────── Doctors (5) ───────────
const doctors = [
  { licenseNumber: "12345", name: 'ד"ר נועה לוי' },
  { licenseNumber: "23456", name: 'ד"ר יוסי כהן' },
  { licenseNumber: "34567", name: 'ד"ר רון אברהם' },
  { licenseNumber: "45678", name: 'ד"ר תמר שפירא' },
  { licenseNumber: "56789", name: 'ד"ר אורן ביטון' },
];

// ─────────── Patients (20) ───────────
// 6 manually verified IDs + 14 generated from base 8-digit numbers.
const manualIds = [
  "123456782",
  "111111118",
  "222222226",
  "333333334",
  "555555556",
  "987654324",
];
const generatedIds = Array.from({ length: 14 }, (_, i) =>
  generateTeudatZehut(String(i * 7 + 10000000)),
);
const allPatientIds = [...manualIds, ...generatedIds];

const patientData = [
  { name: "יעל ישראלי", phone: "052-1234567" },
  { name: "משה כהן", phone: "054-2345678" },
  { name: "שרה לוין", phone: "050-3456789" },
  { name: "דוד אבני", phone: "053-4567890" },
  { name: "רחל חיים", phone: "058-5678901" },
  { name: "אורי גולן", phone: "052-6789012" },
  { name: "מיכל שמש", phone: "054-7890123" },
  { name: "אבי דוד", phone: "050-8901234" },
  { name: "נטע רוזן", phone: "053-9012345" },
  { name: "שלמה גרין", phone: "058-0123456" },
  { name: "דנה קליין", phone: "052-1122334" },
  { name: "גלעד שלום", phone: "054-2233445" },
  { name: "אורית חי", phone: "050-3344556" },
  { name: "בני שרון", phone: "053-4455667" },
  { name: "הילה מור", phone: "058-5566778" },
  { name: "ניר אלון", phone: "052-6677889" },
  { name: "ליאת ברק", phone: "054-7788990" },
  { name: "עומר יוסף", phone: "050-8899001" },
  { name: "שירה אבירם", phone: "053-9900112" },
  { name: "תום פרידמן", phone: "058-0011223" },
];

const patients = patientData.map((p, i) => ({
  idNumber: allPatientIds[i],
  name: p.name,
  phone: p.phone,
}));

// ─────────── Appointments (30) ───────────
const reasonPool = [
  "בדיקה שגרתית",
  "כאבי גב",
  "התייעצות",
  "מעקב לחץ דם",
  "חיסון שגרתי",
  "כאבי ראש",
  "בדיקת דם",
  "בדיקת עיניים",
  "מעקב סוכרת",
  "טיפול שיניים",
  "צילום רנטגן",
  "ייעוץ תזונה",
];

type AppointmentSeed = {
  appointmentDate: Date;
  reason: string;
  doctorLicense: string;
  patientId: string;
};

function buildAppointments(): AppointmentSeed[] {
  const now = new Date();
  const result: AppointmentSeed[] = [];

  const dateAt = (daysOffset: number, hour: number, minute: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  // 10 past appointments — 15..55 days ago, varied hours
  for (let i = 0; i < 10; i++) {
    const daysAgo = -(15 + i * 4);
    const hour = 9 + (i % 8);
    const minute = (i % 2) * 30;
    result.push({
      appointmentDate: dateAt(daysAgo, hour, minute),
      reason: reasonPool[i % reasonPool.length],
      doctorLicense: doctors[i % 5].licenseNumber,
      patientId: patients[i % 20].idNumber,
    });
  }

  // 5 imminent appointments — next 3 days, distinct doctors
  for (let i = 0; i < 5; i++) {
    const daysAhead = (i % 3) + 1;
    const hour = 9 + i * 2;
    result.push({
      appointmentDate: dateAt(daysAhead, hour, 0),
      reason: reasonPool[(i + 3) % reasonPool.length],
      doctorLicense: doctors[i].licenseNumber,
      patientId: patients[(i + 5) % 20].idNumber,
    });
  }

  // 15 future appointments — 4..32 days ahead
  for (let i = 0; i < 15; i++) {
    const daysAhead = 4 + i * 2;
    const hour = 9 + (i % 8);
    const minute = (i % 2) * 30;
    result.push({
      appointmentDate: dateAt(daysAhead, hour, minute),
      reason: reasonPool[(i + 7) % reasonPool.length],
      doctorLicense: doctors[i % 5].licenseNumber,
      patientId: patients[(i + 7) % 20].idNumber,
    });
  }

  return result;
}

const appointments = buildAppointments();

// ─────────── Main ───────────
async function main() {
  console.log("Clearing existing data...");
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});

  console.log(`Seeding ${doctors.length} doctors...`);
  await prisma.doctor.createMany({ data: doctors });

  console.log(`Seeding ${patients.length} patients...`);
  await prisma.patient.createMany({ data: patients });

  console.log(`Seeding ${appointments.length} appointments...`);
  await prisma.appointment.createMany({ data: appointments });

  const [d, p, a] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
  ]);
  console.log(`Done: ${d} doctors, ${p} patients, ${a} appointments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
