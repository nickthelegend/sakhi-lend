import Image from "next/image"

const stats = [
  { value: "5,000+", label: "Women Supported" },
  { value: "₹2.5Cr", label: "Loans Funded" },
  { value: "12%", label: "Average Yield" },
  { value: "98%", label: "Repayment Rate" },
]

export function ImpactSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Our Impact
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Real results for real women. See how Sakhilend is making a difference in communities across India.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/impact-woman.jpg"
              alt="Indian rural woman entrepreneur proudly standing next to her small business"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl bg-card p-6 text-center shadow-sm"
              >
                <p className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
