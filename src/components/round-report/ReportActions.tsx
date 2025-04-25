
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5, // Aumentar a escala para melhor qualidade
        useCORS: true,
        logging: false,
        windowWidth: 2000 // Aumentar a largura da janela virtual para capturar mais conteúdo
      });

      // Sempre usar paisagem para relatórios com muitos participantes
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      // Calcular dimensões preservando a proporção
      const imgWidth = 277; // A4 landscape width in mm
      const pageHeight = 190; // A4 landscape height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Adicionar a imagem com margens adequadas
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        10, // margem esquerda
        10, // margem superior
        imgWidth, 
        imgHeight > pageHeight - 20 ? pageHeight - 20 : imgHeight
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
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
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
