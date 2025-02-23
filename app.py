import csv
import io
from flask import Flask, Response, after_this_request, request,render_template, send_file,url_for, session
from first_normal_prototype import automation, export_csv
app = Flask(__name__)


app.secret_key = 'AnySecretKey'  # Required for session management

@app.route('/')
def index():
    return render_template('input.html')

@app.route('/codons_list', methods=['POST'])
def prototype():
    session['codons'] = request.form['codons']
    session['number_of_codons'] = request.form['number_of_codons']
    button = '''
    <style>
    /* 15 */
.btn-15 {
    background: #b621fe;
    border: none;
    z-index: 1;
  }
  .btn-15:after {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: #663dff;
    border-radius: 5px;
     box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
     7px 7px 20px 0px rgba(0,0,0,.1),
     4px 4px 5px 0px rgba(0,0,0,.1);
    transition: all 0.3s ease;
  }
  .btn-15:hover {
    color: #fff;
  }
  .btn-15:hover:after {
    left: 0;
    width: 100%;
  }
  .btn-15:active {
    top: 2px;
  }
  button {
    margin: 20px;
  }
  .custom-btn {
    width: 130px;
    height: 40px;
    color: #0037ff;
    border-radius: 5px;
    padding: 10px 25px;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
     box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
     7px 7px 20px 0px rgba(0,0,0,.1),
     4px 4px 5px 0px rgba(0,0,0,.1);
    outline: none;
  }
  </style>
    <div>
        <form action="export" method="post">
        <button name="export_button" class="custom-btn btn-15">Export</button>
      </form>
    </div>'''
    html_content = button + automation(int(session['number_of_codons']), session['codons'])
    #return render_template(str(html_filename))
    return Response(
        html_content,
        mimetype="text/html",
        headers={"Content-Disposition": "inline; filename=codon_list.html"}
    )

@app.route('/export', methods=['POST'])
def export():
    codons = session.get('codons', '')
    number_of_codons = session.get('number_of_codons', 3)
    
    csv_content = export_csv(int(number_of_codons),codons)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(csv_content)
    
    csv_string = output.getvalue()  # CSV formatted string
    csv_bytes = csv_string.encode('utf-8')  # Convert string to bytes

    return Response(
        csv_bytes,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=codon_connections.csv"}
    )



"""
@app.route('/import', methods=['POST'])
def importing():

    return Response(
        html_content,
        mimetype="text/html",
        headers={"Content-Disposition": "inline; filename=codon_list.html"}
    )
"""