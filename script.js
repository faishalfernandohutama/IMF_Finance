// get data dari HTML
document
  .getElementById("creditForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      contractNo: document.getElementById("contractNo").value,
      clientName: document.getElementById("clientName").value,
      carPrice: Number(document.getElementById("carPrice").value),
      downPayment: Number(document.getElementById("downPayment").value / 100),
      tenor: Number(document.getElementById("tenor").value),
      startDate: document.getElementById("startDate").value,
    };

    const result = calculateInstallment(data);
    showResult(result);
  });

// logic perhitungan angsuran
function calculateInstallment(data) {
  const dp = data.carPrice * data.downPayment;
  const loan = data.carPrice - dp;
  const totalMonths = data.tenor * 12;
  const monthlyInstallment = Math.round(loan / totalMonths);

  let dueDate = new Date(data.startDate);
  const schedules = [];

  // output tabel angsuran
  for (let i = 1; i <= totalMonths; i++) {
    schedules.push({
      installmentNo: i,
      amount: monthlyInstallment,
      dueDate: dueDate.toISOString().split("T")[0],
    });
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  return { ...data, dp, loan, totalMonths, monthlyInstallment, schedules };
}

function showResult(result) {
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("resContract").innerText = result.contractNo;
  document.getElementById("resClientName").innerText = result.clientName;
  document.getElementById("resDP").innerText = result.dp.toLocaleString();
  document.getElementById("resLoan").innerText = result.loan.toLocaleString();
  document.getElementById("resMonthly").innerText = result.monthlyInstallment.toLocaleString();

  const table = document.getElementById("scheduleTable");

  result.schedules.forEach((schedule) => {
    table.innerHTML += `
        <tr>
        <td>${result.contractNo}</td>
        <td>${schedule.installmentNo}</td>
        <td>Rp ${schedule.amount.toLocaleString()}</td>
        <td>${schedule.dueDate}</td>
        </tr>
        `;
  });
}
