export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && <Icon className="h-16 w-16 text-gray-300 mb-4" strokeWidth={1.5} />}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
