import { useValidators, type Validator } from "../../hooks/useValidators";
import { ValidatorCard } from "./validatorCard";

interface ValidatorListProps {
  mode: "easy" | "expert";
}
export function ValidatorList({ mode }: ValidatorListProps) {
  const { validators, isLoading, error } = useValidators();

  if (isLoading) {
    return <p className="text-surface/60">Loading validators...</p>;
  }
  if (error) {
    return (
      <p className="text-red-500">Error loading validators: {error.message}</p>
    );
  }
  if (validators.length === 0) {
    return <p className="text-surface/60">No validators found.</p>;
  }
  return (
    <div>
      <h1 className="text-primary">Validators </h1>
      <div className="grid gap-4">
        {validators.map((validator) => (
          <ValidatorCard
            key={validator.address}
            validator={validator}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}
