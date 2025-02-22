from flask import Flask, request,render_template,url_for
from first_normal_prototype import automation
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('input.html')

@app.route('/codons_list', methods=['POST'])
def prototype():
    # Create an field to enter the desired Codons
    # Create a field to decide wheather you want 2,3,4 codons set.
    # Create submit field.
    # Create an import and export button
    codons = request.form['codons']
    number_of_codons = request.form['number_of_codons']
    html_filename = automation(int(number_of_codons),codons)
    print(html_filename)
    return render_template(str(html_filename))