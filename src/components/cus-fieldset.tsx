export function CusFieldset({ title, children }: { title?: string, children?: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-lg font-medium">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}
