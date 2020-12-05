import csv, json

inputFilename = "encuesta-2021.csv"
outputFilename = "public/data/encuesta-2021.json"

areas2021 = ["Algoritmos e Investigación Operativa",
    "Imágenes",
    "Ingeniería de Software",
    "Inteligencia Artificial",
    "Interdisciplina",
    "Sistemas",
    "Teoría"]

respuestas = []

with open(inputFilename) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        respuesta = {
            "timestamp": row["Marca temporal"],
            "materias": []
        }
        for area in areas2021:
            if row[area]:
                respuesta["materias"].extend(row[area].split(";"))
        respuestas.append(respuesta)

with open(outputFilename, "w") as jsonfile:
    jsonfile.write(json.dumps(respuestas, indent=4))
    jsonfile.close()

