
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportActionsProps {
  reportRef: React.RefObject<HTMLDivElement>;
  selectedRound: number;
}

export const ReportActions = ({ reportRef, selectedRound }: ReportActionsProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`relatorio-rodada-${selectedRound}.pdf`);
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
