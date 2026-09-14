const MAX_AMOUNT = 999_999_999_999;

export function validateTransaction(input) {
  const errors = {};
  const type = input?.type;
  const description = String(input?.description ?? '').trim();
  const amount = Number(input?.amount);
  const date = String(input?.date ?? '');
  const today = new Date().toISOString().slice(0, 10);

  if (!['income', 'expense'].includes(type)) {
    errors.type = 'Elegí si es un ingreso o un gasto.';
  }

  if (!description) {
    errors.description = 'La descripción es obligatoria.';
  } else if (description.length < 2) {
    errors.description = 'Usá al menos 2 caracteres.';
  } else if (description.length > 100) {
    errors.description = 'La descripción no puede superar los 100 caracteres.';
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Ingresá un monto mayor a cero.';
  } else if (amount > MAX_AMOUNT) {
    errors.amount = 'El monto ingresado es demasiado grande.';
  }

  if (!date) {
    errors.date = 'La fecha es obligatoria.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'La fecha no tiene un formato válido.';
  } else if (date > today) {
    errors.date = 'No podés registrar movimientos futuros.';
  }

  return errors;
}

export function getTodayInputDate() {
  return new Date().toISOString().slice(0, 10);
}
