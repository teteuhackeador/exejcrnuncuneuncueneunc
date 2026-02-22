import { Instagram, MessageCircle, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border py-10">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-bold text-lg uppercase text-foreground mb-3">
            🍔 Hamburgueria Modelo
          </h3>
          <p className="text-muted-foreground text-sm">
            Os melhores hambúrgueres artesanais da cidade.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Contato</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a
              href="https://wa.me/5533999999959"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              (33) 99999-9959
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Rua dos Sabores, 123
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Redes Sociais</h4>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/teteu21x"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-foreground"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5533999999959"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors text-foreground"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 Hamburgueria Modelo. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
