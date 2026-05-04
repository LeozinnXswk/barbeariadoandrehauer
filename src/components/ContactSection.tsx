import { MapPin, Phone, Copy } from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  "Dinheiro", "Cartão de Débito", "Cartão de Crédito", "Pix",
];

const phoneContacts = [
  { name: "Barbeiro André", phone: "(41) 99553-0001" },
  { name: "Barbeiro José", phone: "(41) 99143-9149" },
  { name: "Barbeiro Kauê", phone: "(41) 99824-4945" },
];

const ContactSection = () => {
  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success("Número copiado!");
  };

  return (
    <section id="contato" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-gold-gradient text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
          Contato
        </h2>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-primary font-heading text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Localização
            </h3>
            <p className="text-muted-foreground">
              R. Prof. João Soares Barcelos, 1147 - Loja 01 - Hauer, Curitiba - PR, 81630-060
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-primary font-heading text-lg font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Telefones
            </h3>
            <div className="space-y-3">
              {phoneContacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-foreground text-sm font-semibold">{c.name}</span>
                    <p className="text-muted-foreground text-sm">{c.phone}</p>
                  </div>
                  <button
                    onClick={() => copyPhone(c.phone)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-primary font-heading text-lg font-semibold mb-4">
              Formas de Pagamento
            </h3>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
