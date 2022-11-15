// const categories = [
//   'food',
//   'household chemicals',
//   'alcohol',
//   'restaurants',
//   'health',
//   'childs',
//   'rent',
//   'credits',
//   'clothes',
//   'oil',
//   'entertainment',
//   'tel and internet',
//   'others',
// ]

// // categories.forEach((item, index) => {
// //   let category = document.createElement('tr')
// //   category.innerHTML = `<td></td>`
// //   document.querySelector(
// //     '.categories'
// //   ).innerHTML = `<tr><td>${item}</td><td>20</td></tr>`
// //   console.log(item)
// // })

// let category = document.querySelector('.categories')
// categories.forEach(
//   (el) => (category.innerHTML += '<tr><td>' + el + '</td><td>20</td></tr>')
// )

class BudgetTracker {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString)
    this.root.innerHTML = BudgetTracker.html()

    this.root.querySelector('.new-entry').addEventListener('click', () => {
      this.onNewEntry()
    })

    // load initial data from local storage
    this.load()
  }

  static html() {
    return `
    <table class="budget-tracker">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="entries"></tbody>
      <tbody>
        <tr>
          <td colspan="5" class="controls">
            <button type="button" class="new-entry">New Entry</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="summary">
            <strong>Total:</strong>
            <span class="total">0.00</span>
          </td>
        </tr>
      </tfoot>
   </table>
    `
  }

  static entryHtml() {
    return `
    <tr>
        <td>
          <input type="date" class="input input-date">
        </td>
        <td>
          <input type="text" placeholder="add a desc" class="input input-description">
        </td>
        <td>
          <select class="input input-type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </td>
        <td>
          <input type="number" class="input input-amount">
        </td>
        <td>
          <button type="button" class="delete-entry">&#10005;</button>
        </td>
     </tr>
    `
  }

  load() {
    const entries = JSON.parse(
      localStorage.getItem('budget-tracker-entries') || '[]'
    )

    for (const entry of entries) {
      this.addEntry(entry)
    }

    this.updateSummary()
  }

  updateSummary() {
    const total = this.getEntryRows().reduce((total, row) => {
      const amount = row.querySelector('.input-amount').value
      const isExpense = row.querySelector('.input-type').value === 'expense'
      const modifier = isExpense ? -1 : 1

      return total + amount * modifier
    }, 0)

    const totalFormatted = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(total)

    this.root.querySelector('.total').textContent = totalFormatted
  }

  save() {
    const data = this.getEntryRows().map((row) => {
      return {
        date: row.querySelector('.input-date').value,
        description: row.querySelector('.input-description').value,
        type: row.querySelector('.input-type').value,
        amount: parseFloat(row.querySelector('.input-amount').value),
      }
    })
    localStorage.setItem('budget-tracker-entries', JSON.stringify(data))
    this.updateSummary()
  }

  addEntry(entry = {}) {
    this.root
      .querySelector('.entries')
      .insertAdjacentHTML('beforeend', BudgetTracker.entryHtml())

    const row = this.root.querySelector('.entries tr:last-of-type')

    row.querySelector('.input-date').value =
      entry.date || new Date().toISOString().replace(/T.*/, '')

    row.querySelector('.input-description').value = entry.description || ''

    row.querySelector('.input-type').value = entry.type || 'expense'
    row.querySelector('.input-amount').value = entry.amount || 0
    row.querySelector('.delete-entry').addEventListener('click', (e) => {
      this.onDelete(e)
    })

    row.querySelectorAll('.input').forEach((input) => {
      input.addEventListener('change', () => this.save())
    })
  }

  getEntryRows() {
    return Array.from(this.root.querySelectorAll('.entries tr'))
  }

  onNewEntry() {
    this.addEntry()
  }

  onDelete(e) {
    e.target.closest('tr').remove()
    this.save()
  }
}
class AverageCost {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString)
    this.root.innerHTML = AverageCost.html()

    this.root.querySelector('.new-entry').addEventListener('click', () => {
      this.onNewEntry()
    })

    // load initial data from local storage
    this.load()
  }

  static html() {
    return `
    <table class="average-cost">
      <thead>
        <tr>
          <th>Sum</th>
          <th>Cost in rub</th>
          <th>Conversion cost</th>
          <th>Comments</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="entries"></tbody>
      <tbody>
        <tr>
          <td colspan="5" class="controls">
            <button type="button" class="new-entry">New  Conversation</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="summary">
            <strong>Average usd cost:</strong>
            <span class="total">0.00</span>
          </td>
        </tr>
      </tfoot>
   </table>
    `
  }

  static entryHtml() {
    return `
      <tr>
        <td>
          <input type="number" placeholder="add a sum" class="input input-usd">
        </td>
        <td>
          <input type="number" placeholder="sum in rub" class="input input-rub">
        </td>
        <td>
        <input type="text" class="input input-cost">
        </td>
        <td>
          <input type="text"  class="input input-comments">
        </td>
        <td>
          <button type="button" class="delete-entry">&#10005;</button>
        </td>
      </tr>
    `
  }

  load() {
    const entries = JSON.parse(
      localStorage.getItem('average-cost-entries') || '[]'
    )

    for (const entry of entries) {
      this.addEntry(entry)
    }

    this.updateSummary()
  }

  updateSummary() {
    // const total = this.getEntryRows().reduce((total, row) => {
    //   const amount = row.querySelector('.input-amount').value
    //   const isExpense = row.querySelector('.input-type').value === 'expense'
    //   const modifier = isExpense ? -1 : 1
    //   return total + amount * modifier
    // }, 0)
    // const totalFormatted = new Intl.NumberFormat('ru-RU', {
    //   style: 'currency',
    //   currency: 'RUB',
    //   minimumFractionDigits: 0,
    // }).format(total)
    // this.root.querySelector('.total').textContent = totalFormatted
  }

  save() {
    const data = this.getEntryRows().map((row) => {
      return {
        sum: row.querySelector('.input-usd').value,
        rub: row.querySelector('.input-rub').value,
        cost: row.querySelector('.input-cost').value,
        comments: parseFloat(row.querySelector('.input-comments').value),
      }
    })
    localStorage.setItem('average-cost-entries', JSON.stringify(data))
    this.updateSummary()
  }

  addEntry(entry = {}) {
    this.root
      .querySelector('.entries')
      .insertAdjacentHTML('beforeend', AverageCost.entryHtml())

    const row = this.root.querySelector('.entries tr:last-of-type')

    row.querySelector('.input-usd').value = entry.amount || 0

    row.querySelector('.input-rub').value = entry.amount || 0

    row.querySelector('.input-cost').value = entry.amount || 0
    row.querySelector('.input-amount').value = entry.amount || 0
    row.querySelector('.delete-entry').addEventListener('click', (e) => {
      this.onDelete(e)
    })

    row.querySelectorAll('.input').forEach((input) => {
      input.addEventListener('change', () => this.save())
    })
  }

  getEntryRows() {
    return Array.from(this.root.querySelectorAll('.entries tr'))
  }

  onNewEntry() {
    this.addEntry()
  }

  onDelete(e) {
    e.target.closest('tr').remove()
    this.save()
  }
}

new BudgetTracker('.app')

new AverageCost('.app')
