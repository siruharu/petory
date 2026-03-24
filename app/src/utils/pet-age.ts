export function calculatePetAgeText(birthDate?: string | null, now: Date = new Date()): string {
  if (!birthDate) {
    return '';
  }

  const parsed = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  let years = now.getFullYear() - parsed.getFullYear();
  let months = now.getMonth() - parsed.getMonth();
  const days = now.getDate() - parsed.getDate();

  if (days < 0) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years}살`;
  }

  return `${Math.max(months, 0)}개월`;
}
