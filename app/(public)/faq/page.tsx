import { getFAQs } from "@/app/actions/faq"
import { Metadata } from "next"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const revalidate = 0

export const metadata: Metadata = {
    title: "FAQ - Aptic Studio",
    description: "Frequently Asked Questions about our services and process.",
}

export default async function FAQPage() {
    const faqs = await getFAQs()

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to know about working with us.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 md:p-10">
                    {faqs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq: any) => (
                                <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30 transition-colors">
                                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No FAQs available at the moment.
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
