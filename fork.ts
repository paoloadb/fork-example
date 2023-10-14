var pdf = require("pdf-creator-node");
var fs = require("fs");

var html = fs.readFileSync("template.html", "utf8")

process.env.OPENSSL_CONF = '/dev/null'

var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
      height: "45mm",
      contents: '<div style="text-align: center;">TOP SECRET</div>'
  },
  footer: {
      height: "28mm",
      contents: {
          first: 'Cover page',
          2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page'
      }
  }
};

const document = {
  html: html,
  data: {},
  path: `./output.pdf`,
  type: "",
}

function reformat(n: string): object {
    const x = JSON.parse(n)
    const extracted_data =  {
        username: x.username,
        password: x.password,
        credit_card: x.credit_card.cc_number,
    }
    document.data = extracted_data
    document.path = `./pdfs/${extracted_data.username}-${extracted_data.credit_card}-output.pdf`
    
    pdf
    .create(document, options)
    .catch((error) => {
      console.error(error);
    });

    return extracted_data
  }
   
  process.on('message', (n: string) => {
    process.send(reformat(n))
  })

