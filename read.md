<!-- Service portfoilio old -->
 <!-- <section className="py-16 px-4 bg-white">

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Service Portfolio
              </h2>
              <p className="text-xl text-gray-700">
                Comprehensive digital solutions delivered under your brand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.slice(0, 6).map((service) => {
                const Icon = service.icon;
                const hasCoupon = service.couponCode;
                return (
                  <Card key={service.id} className="relative overflow-hidden flex flex-col h-full">
                    {hasCoupon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-brand-coral text-white text-xs font-bold animate-pulse">
                          {service.discount}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-brand-coral" />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-purple min-h-[3.5rem] flex items-center">
                        <h3>{service.title}</h3>
                      </CardTitle>
                      <p className="text-gray-700 min-h-[3rem] flex items-start">{service.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="text-2xl font-bold text-brand-purple">
                          {service.pricing}
                        </div>
                        {service.id === "dedicated-resources" ? (
                          <div className="space-y-2 min-h-[2.5rem]">
                            <div className="text-sm text-brand-coral font-semibold">
                              Average 60% cost savings vs. in-house team
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-brand-coral font-semibold min-h-[2.5rem] flex items-start">
                            {service.metrics}
                          </div>
                        )}
                        <ul className="space-y-2 flex-1 min-h-[8rem]">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 space-y-6">
                        {service.id === "n8n-automations" ? (
                          <>
                            <div className="text-center py-3 mb-2">
                              <span className="text-brand-coral font-semibold text-lg">
                                Coming Soon
                              </span>
                            </div>
                            <Link href={service.href}>
                              <Button
                                variant="outline"
                                className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        ) : hasCoupon ? (
  <div className="space-y-4">
    {!showCoupons[service.id] ? (
      <Button
        onClick={() => handleRevealCoupon(service.id)}
        className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors"
      >
        <Gift className="w-4 h-4 mr-2" />
        Get {service.discount} - {service.discountDescription}
      </Button>
    ) : (
      <div className="space-y-4">
        <div className="p-4 bg-brand-coral/10 border border-brand-coral/20 rounded-lg">
          <div className="text-sm font-medium text-brand-purple mb-3">
            Your coupon code:
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded border">
            <code className="font-mono text-sm font-bold text-brand-purple flex-1">
              {service.couponCode}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopyCoupon(service.couponCode, service.id)
              }
              className="h-8 px-3 text-xs border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3 mr-1" />
              {couponCopied[service.id] ? "✓" : "Copy"}
            </Button>
          </div>
        </div>
        <Link
          href={`/contact?coupon=${service.couponCode}&service=${service.id}`}
        >
          <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold transition-colors">
            Use Coupon in Contact Form
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )}

    <Link href={service.href}>
      <Button
        variant="outline"
        className="w-full h-11 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </div>
)
 : (
                          <Link href={service.href}>
                            <Button className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white transition-colors">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>  -->

<!--  -->

