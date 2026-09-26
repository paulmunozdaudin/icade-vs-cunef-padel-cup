import { AGE_RANGE, UNIVERSITIES, type University } from "./config";

/** Datos que rellena cada participante en el checkout. */
export interface Registration {
  fullName: string;
  email: string;
  age: number;
  university: University;
  partnerName: string;
  /** El participante confirma que su pareja es de su misma universidad. */
  partnerSameUniversity: true;
}

export type RegistrationField = keyof Registration;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

/** Borrador del formulario tal cual lo tiene el cliente (todo texto). */
export interface RegistrationDraft {
  fullName: string;
  email: string;
  age: string;
  university: University | "";
  partnerName: string;
  partnerSameUniversity: boolean;
}

export const EMPTY_DRAFT: RegistrationDraft = {
  fullName: "",
  email: "",
  age: "",
  university: "",
  partnerName: "",
  partnerSameUniversity: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Minúsculas, sin tildes y con espacios normalizados: "  José  GARCÍA" -> "jose garcia". */
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Nombre + al menos un apellido. */
function isFullName(value: string): boolean {
  return value.split(" ").filter((part) => part.length >= 2).length >= 2;
}

/**
 * Valida un borrador (en el cliente) o un body JSON (en el servidor). Se usa
 * en ambos lados para que las reglas sean exactamente las mismas.
 */
export function validateRegistration(
  input: Partial<Record<RegistrationField, unknown>>,
): { ok: true; data: Registration } | { ok: false; errors: RegistrationErrors } {
  const errors: RegistrationErrors = {};

  const fullName = cleanText(input.fullName);
  if (!fullName) errors.fullName = "Escribe tu nombre y apellidos.";
  else if (!isFullName(fullName)) errors.fullName = "Incluye nombre y al menos un apellido.";
  else if (fullName.length > 80) errors.fullName = "Máximo 80 caracteres.";

  const email = cleanText(input.email).toLowerCase();
  if (!email) errors.email = "Escribe tu email.";
  else if (!EMAIL_RE.test(email) || email.length > 120) errors.email = "Ese email no parece válido.";

  const rawAge = typeof input.age === "number" ? String(input.age) : cleanText(input.age);
  const age = Number(rawAge);
  if (!rawAge) errors.age = "Indica tu edad.";
  else if (!/^\d{1,3}$/.test(rawAge) || age < AGE_RANGE.min || age > AGE_RANGE.max)
    errors.age = "Introduce una edad válida (solo números enteros).";

  const university = input.university;
  const isUniversity = UNIVERSITIES.includes(university as University);
  if (!isUniversity) errors.university = "Elige ICADE o CUNEF.";

  const partnerName = cleanText(input.partnerName);
  if (!partnerName) errors.partnerName = "Escribe el nombre y apellidos de tu pareja.";
  else if (!isFullName(partnerName)) errors.partnerName = "Incluye nombre y al menos un apellido.";
  else if (partnerName.length > 80) errors.partnerName = "Máximo 80 caracteres.";
  else if (fullName && normalizeName(partnerName) === normalizeName(fullName))
    errors.partnerName = "Tu pareja tiene que ser otra persona.";

  if (input.partnerSameUniversity !== true)
    errors.partnerSameUniversity = isUniversity
      ? `Confirma que tu pareja también es de ${university as University}.`
      : "Confirma que tu pareja es de tu misma universidad.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      fullName,
      email,
      age,
      university: university as University,
      partnerName,
      partnerSameUniversity: true,
    },
  };
}
