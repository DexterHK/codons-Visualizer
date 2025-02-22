import os
from flask import Flask, Response, after_this_request, request,render_template, send_file,url_for
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
    html_content = automation(int(number_of_codons),codons) #77777
    print(html_content)
    #return render_template(str(html_filename))
    return Response(
        html_content,
        mimetype="text/html",
        headers={"Content-Disposition": "inline; filename=codon_list.html"}
    )

