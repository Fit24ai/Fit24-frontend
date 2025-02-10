export default function Rules() {
  const rules = [
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
    "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis lorem nisi sed.",
  ]
  return (
    <div className="w-full md:py-10 py-4 md:px-10 px-4 flex flex-col gap-6 items-center md:max-h-[78vh] max-h-[80vh] overflow-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-semibold">General Rewards</div>
        <div className="text-gray-400 md:text-base text-xs text-center md:px-10 px-4">
          Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing
          mattis lorem  nisi sed. Et eget pellentesque ridicul.
        </div>
      </div>
      <div className="flex flex-col gap-2 text-gray-400 md:text-lg text-sm">
        <ul className="list-disc flex flex-col gap-2 pl-4 md:pl-0">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
