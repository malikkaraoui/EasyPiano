/**
 * ChipSelect — composant de sélection par chips réutilisable.
 *
 * Mode multi  : plusieurs valeurs sélectionnables (checkboxes).
 * Mode single : une seule valeur active à la fois (radios).
 *
 * @param {{ options: { code: string, label: string }[], selected: string[] | string, onToggle: (code: string) => void, multi?: boolean, name: string, legend?: string, hint?: string, disabled?: boolean }} props
 */
export function ChipSelect({
  options,
  selected,
  onToggle,
  multi = true,
  name,
  legend,
  hint,
  disabled = false,
}) {
  function isSelected(code) {
    return multi ? selected.includes(code) : selected === code;
  }

  return (
    <fieldset disabled={disabled}>
      {legend && (
        <legend className="mb-2 text-sm font-medium text-foreground">
          {legend}
        </legend>
      )}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={legend || name}
      >
        {options.map((option) => {
          const active = isSelected(option.code);
          const inputId = `${name}-${option.code}`;

          return (
            <label
              key={option.code}
              htmlFor={inputId}
              className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-accent ${
                active
                  ? "border-white bg-white text-black shadow-sm"
                  : "border-border surface-solid text-foreground hover:border-accent hover:text-accent"
              } ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                id={inputId}
                type={multi ? "checkbox" : "radio"}
                name={name}
                value={option.code}
                checked={active}
                onChange={() => onToggle(option.code)}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </fieldset>
  );
}
