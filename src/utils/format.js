const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});
export const money = (value) => currency.format(Number(value) || 0);
