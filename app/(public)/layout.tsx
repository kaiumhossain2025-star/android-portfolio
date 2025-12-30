import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsappFloat from "@/components/whatsapp-float"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="bg-background text-foreground min-h-screen">
                {children}
            </main>
            <Footer />
            <WhatsappFloat />
        </>
    )
}
