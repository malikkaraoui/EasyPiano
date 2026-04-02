import { Input } from "@/components/UI/input";
import {
  DEFAULT_DIAL_CODE,
  formatNationalPhoneNumber,
  normalizePhoneFieldValue,
  sanitizeDialCodeInput,
} from "@/lib/phone";
import { cn } from "@/lib/utils";

function PhoneNumberField({
  id,
  label = "Téléphone",
  value,
  onValueChange,
  required = false,
  disabled = false,
  hint,
  className,
  defaultDialCode = DEFAULT_DIAL_CODE,
  dialCodeLabel = "Indicatif",
  nationalNumberLabel = "Numéro",
  dialCodePlaceholder = "+41",
  nationalNumberPlaceholder = "79 123 45 67",
}) {
  const normalizedValue = normalizePhoneFieldValue(value, defaultDialCode);
  const dialCodeId = `${id}-dial-code`;
  const nationalNumberId = `${id}-national-number`;
  const hintId = hint ? `${id}-hint` : undefined;

  function updateValue(nextValue) {
    onValueChange?.(normalizePhoneFieldValue(nextValue, defaultDialCode));
  }

  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required ? " *" : ""}
      </legend>

      <div className="grid gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <div className="space-y-1.5">
          <label
            htmlFor={dialCodeId}
            className="block text-xs font-medium uppercase tracking-[0.08em] text-muted"
          >
            {dialCodeLabel}
          </label>
          <Input
            id={dialCodeId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-country-code"
            value={normalizedValue.dialCode}
            onChange={(event) =>
              updateValue({
                dialCode: sanitizeDialCodeInput(event.target.value),
                nationalNumber: normalizedValue.nationalNumber,
              })
            }
            placeholder={dialCodePlaceholder}
            disabled={disabled}
            required={required}
            aria-describedby={hintId}
            className="text-center font-medium tracking-[0.06em]"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={nationalNumberId}
            className="block text-xs font-medium uppercase tracking-[0.08em] text-muted"
          >
            {nationalNumberLabel}
          </label>
          <Input
            id={nationalNumberId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={normalizedValue.nationalNumber}
            onChange={(event) =>
              updateValue({
                dialCode: normalizedValue.dialCode,
                nationalNumber: formatNationalPhoneNumber(event.target.value),
              })
            }
            placeholder={nationalNumberPlaceholder}
            disabled={disabled}
            required={required}
            aria-describedby={hintId}
            className="font-medium tracking-[0.04em]"
          />
        </div>
      </div>

      {hint ? (
        <p id={hintId} className="text-xs leading-5 text-muted">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

export { PhoneNumberField };
