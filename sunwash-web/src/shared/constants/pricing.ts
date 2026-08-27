export const PRICING = {
  BASE_FEE: 120.0, // Taxa base de deslocamento e inspeção
  PRICE_PER_PANEL: 15.0, // R$ 15 por painel solar
  DRONE_INSPECTION_INCLUDED: true,
  MINIMUM_PANELS: 4,
};

export const calculateServicePrice = (panelsCount: number): number => {
  const effectivePanels = Math.max(panelsCount || PRICING.MINIMUM_PANELS, PRICING.MINIMUM_PANELS);
  return PRICING.BASE_FEE + effectivePanels * PRICING.PRICE_PER_PANEL;
};
