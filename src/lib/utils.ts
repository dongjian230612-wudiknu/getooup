import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function validatePrescription(prescription: {
  rightSphere: string;
  rightCylinder: string;
  rightAxis: string;
  leftSphere: string;
  leftCylinder: string;
  leftAxis: string;
  pd: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Sphere validation (-20.00 to +20.00)
  const sphereRegex = /^-?(\d{1,2}\.\d{2}|\d{1,2})$/;
  if (!sphereRegex.test(prescription.rightSphere)) {
    errors.push('Right eye sphere must be a number between -20.00 and +20.00');
  }
  if (!sphereRegex.test(prescription.leftSphere)) {
    errors.push('Left eye sphere must be a number between -20.00 and +20.00');
  }

  // Cylinder validation (-6.00 to +6.00)
  const cylRegex = /^-?(\d\.\d{2}|\d)$/;
  if (prescription.rightCylinder && !cylRegex.test(prescription.rightCylinder)) {
    errors.push('Right eye cylinder must be between -6.00 and +6.00');
  }
  if (prescription.leftCylinder && !cylRegex.test(prescription.leftCylinder)) {
    errors.push('Left eye cylinder must be between -6.00 and +6.00');
  }

  // Axis validation (0-180)
  const axisRegex = /^(\d{1,3})$/;
  if (prescription.rightAxis) {
    const rightAxisNum = parseInt(prescription.rightAxis);
    if (!axisRegex.test(prescription.rightAxis) || rightAxisNum > 180) {
      errors.push('Right eye axis must be between 0 and 180');
    }
  }
  if (prescription.leftAxis) {
    const leftAxisNum = parseInt(prescription.leftAxis);
    if (!axisRegex.test(prescription.leftAxis) || leftAxisNum > 180) {
      errors.push('Left eye axis must be between 0 and 180');
    }
  }

  // PD validation (50-80mm)
  const pdRegex = /^(\d{2})$/;
  if (!pdRegex.test(prescription.pd)) {
    errors.push('Pupillary Distance (PD) must be between 50 and 80');
  } else {
    const pdNum = parseInt(prescription.pd);
    if (pdNum < 50 || pdNum > 80) {
      errors.push('PD must be between 50mm and 80mm');
    }
  }

  return { valid: errors.length === 0, errors };
}
