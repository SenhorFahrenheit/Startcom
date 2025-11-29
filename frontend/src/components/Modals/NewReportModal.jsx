import { toast } from "react-toastify";
import { useState } from "react";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import SelectDropdown from "../SelectDropdown/SelectDropdown";

/**
 * NewReportModal component
 * Modal responsible for generating system reports.
 */
const NewReportModal = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState("Vendas");
  const [format, setFormat] = useState("PDF");
  const [period, setPeriod] = useState("Última semana");

  /**
   * Handle report generation
   */
  const newReport = (e) => {
    e.preventDefault();

    const data = {
      type: topic,
      format,
      period
    };

    console.log("Dados validados:", data);

    toast.success("Relatório gerado com sucesso!", {
      position: "top-right",
      containerId: "toast-root",
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Criar Novo Relatório"
      width="620px"
      height="auto"
      showCloseButton
    >
      <h2 className="dashboard-modal-title">Gerar Novo Relatório</h2>

      <form className="form-dashboard" onSubmit={newReport}>
        <div className="align-dashboard-form">

          <div className="input-dashboard-block">
            <label htmlFor="topic">Tópico</label>
            <SelectDropdown
              name="type"
              items={[
                { label: "Vendas", value: "Vendas" },
                { label: "Clientes", value: "Clientes" },
                { label: "Estoque", value: "Estoque" },
              ]}
              placeholder={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <InfoTooltip text="Tópico do relatório que você deseja gerar. Ex.: Vendas, Clientes ou Estoque." />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="format">Formato</label>
            <SelectDropdown
              name="format"
              items={[
                { label: "PDF", value: "PDF" },
                { label: "EXCEL", value: "EXCEL" },
              ]}
              placeholder={format}
              onChange={(e) => setFormat(e.target.value)}
            />
            <InfoTooltip text="Formato do arquivo do relatório. Ex.: PDF ou EXCEL." />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="period">Período</label>
            <SelectDropdown
              name="period"
              items={[
                { label: "Última semana", value: "Última semana" },
                { label: "Último mês", value: "Último mês" },
                { label: "Último ano", value: "Último ano" },
              ]}
              placeholder={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <InfoTooltip text="Período que o relatório irá abranger. Ex.: Última semana, Último mês ou Último ano." />
          </div>

        </div>

        <div className="button-shadown">
          <Button height={45} width={200} type="submit" label="Gerar Relatório" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewReportModal;