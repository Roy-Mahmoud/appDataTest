class Widget {
  constructor() {
     this.init();
  }


  init() {
    this.submitButton = document.querySelector('.add-record__submit');
    document.querySelector('.add-record').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.querySelector('.add-record__input');
      const recordData = input.value;
      if(this.currentRecordId) {
        buildfire.appData.update(this.currentRecordId, {name : recordData}, "testAppData", (err, result) => {
          const recordIndex = this.records.findIndex(rec => rec.id === this.currentRecordId);
          console.log(recordIndex);
          this.records[recordIndex] = result;
          this.currentRecordId = null;
          input.value = '';
          this.renderRecords();
          this.submitButton.textContent = 'Add';
        })
      } else {
        buildfire.appData.insert({name : recordData}, "testAppData", false, (err, res) => {
          this.records.push(res);
          input.value = ''
          this.renderRecords();
        });
      }
    })

    buildfire.appData.search({}, "testAppData", (err, res) => {
      if(err) return console.log(err);
      if(res) {
        this.records = res;
        this.renderRecords()
      }
    });


    document.querySelector('.list-view').addEventListener('click', ({target}) => {
      if(target && target.dataset && target.dataset.recordId) {
        if(target.dataset.mode === 'delete') {
          buildfire.appData.delete( target.dataset.recordId, 'testAppData',(err, result) => {
            if(err) return console.log(err);
            this.records = this.records.filter(rec => rec.id !== target.dataset.recordId);
            this.renderRecords();
          })
        } else {
          this.currentRecordId = target.dataset.recordId;
          document.querySelector('.add-record__input').value = target.dataset.recordName;
          this.submitButton.textContent = 'Save';
        }
       
      }
    }) 
  }


  renderRecords() {
    const listView = document.querySelector('.list-view');
    listView.innerHTML = '';
    this.records.forEach(rec => {
      const recordMarkup = `<div class="record" >
      <span class="record__name" >${rec.data.name}</span>
      <div class="record__actions" >
      <span class="record__delete" mode="delete" data-record-id="${rec.id}" >Delete</span><span class="record__edit" mode="edit" data-record-name="${rec.data.name}" data-record-id="${rec.id}"  >Edit</span>
      </div>
      </div>`;
      listView.innerHTML += recordMarkup;
    })

  }
}

