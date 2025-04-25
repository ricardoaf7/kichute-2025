
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ReportActionsProps {
  reportRef: React.RefObject<HTMLDivElement>;
  selectedRound: number;
  selectedMonth?: string;
  selectedYear?: string;
  title?: string;
}

export const ReportActions = ({ 
  reportRef, 
  selectedRound,
  selectedMonth = "all",
  selectedYear = "2025",
  title = ""
}: ReportActionsProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) {
      toast.error("Não foi possível criar o PDF. Tente novamente.");
      return;
    }

    toast.info("Gerando PDF. Isso pode levar alguns segundos...");

    try {
      // Aumentar escala para melhor qualidade
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        windowWidth: 2500, // Aumentar para capturar mais conteúdo
        onclone: (document, element) => {
          // Ajustar estilos para melhorar a renderização do PDF
          const clone = element;
          const styles = document.createElement('style');
          styles.innerHTML = `
            .table-cell { padding: 4px !important; }
            body { background: white; }
            * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          `;
          document.head.appendChild(styles);
          return clone;
        }
      });

      // Sempre usar paisagem para relatórios
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      // Dimensões de uma página A4 em paisagem
      const pdfWidth = 297; 
      const pdfHeight = 210;
      
      // Calcular dimensões preservando a proporção
      const imgWidth = pdfWidth - 20; // 10mm de margem em cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Adicionar a imagem com margens adequadas
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        10, // margem esquerda
        10, // margem superior
        imgWidth, 
        imgHeight > pdfHeight - 20 ? pdfHeight - 20 : imgHeight
      );
      
      // Determinar nome do arquivo baseado nos filtros
      let filename = "relatorio";
      if (selectedRound > 0) {
        filename += `-rodada-${selectedRound}`;
      } else if (selectedMonth !== "all") {
        filename += `-mes-${selectedMonth}-${selectedYear}`;
      } else {
        filename += `-anual-${selectedYear}`;
      }
      
      pdf.save(`${filename}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    }
  };

  return (
    <div className="flex gap-4 print:hidden">
      <Button onClick={handleExportPDF} variant="outline">
        <FileDown className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button onClick={handlePrint} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
    </div>
  );
};
