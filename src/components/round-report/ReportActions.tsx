
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
        scale: 1.5, // Reduzir a escala para caber mais conteúdo
        useCORS: true,
        logging: false
      });

      // Determinar orientação baseada no número de colunas
      const orientation = "landscape"; // Usar paisagem como padrão para relatórios
      
      // Criar PDF com orientação apropriada
      const pdf = new jsPDF(orientation, 'mm', 'a4');
      
      // Calcular dimensões
      const imgWidth = orientation === 'landscape' ? 277 : 190; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Adicionar a imagem centrada
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        orientation === 'landscape' ? 10 : 10, // margem esquerda
        10, // margem superior
        imgWidth, 
        imgHeight
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
