# -*- coding: utf-8 -*-

import json
import datetime
import io
import sys
from random import randint

def random_last_year_date():
	return (datetime.datetime.now() - datetime.timedelta(days=randint(0,365))).isoformat()

departments = ["rekvisita", "möbel", "kostym"]
departments_dict = {}

departments_dict.update({"rekvisita" : [
	{"main":"affär","sub":["matförpackning","godis","tobak","rengöring","plexiställ","prislappspistol","smink"]},
	{"main":"baby","sub":["nappflaska","tallrik","bestik","bärsele","lakan","bädd"]},
	{"main":"bar","sub":["flaska","burk","shaker","ishink","sifon","champkyl"]},
	{"main":"bestik","sub":["modern","epok","R.F","N.F","bakelit","plast","trä","smide"]},
	{"main":"blomma","sub":["kruka/vas","ampel","plastblomma","vattenkanna","vattenspruta"]},
	{"main":"bädd/textil","sub":["duk","servett","lakan","påslakan","örngott","kudde","täcke","filt","handduk"]},
	{"main":"camping","sub":["sovsäck","liggunderlag","stormkök","kåsa","ryggsäck"]},
	{"main":"elektronik","sub":["dator","datormus","tangentbord","radio","skivspelare","grammofon","TV"]},
	{"main":"fejk","sub":["mat","pryl"]},
	{"main":"förbrukvara","sub":["pizzakartong","snabbmatsförp","engångsbestik","kaffekopp","sugrör","servett"]},
	{"main":"instrument","sub":["blåsinstrument","munspel","tamburin","maraccas","dragspel","slagverk","gitarr","fiol","fodral/väska"]},
	{"main":"jul","sub":["paket","julkulor","julstrumpor","adventsljusstake","julstjärna","glitter","julgransbelysning","prydnadstomte"]},
	{"main":"vapen","sub":["svärd","sablar","knivar","gevär","pistol","höllster"]},
	{"main":"konstnär","sub":["färger","penslar","skiss","målarduk"]},
	{"main":"telefoner","sub":["epok","siffersnurr","knappar","trådlösa"]},
	{"main":"kök","sub":["tenn","silver","kastrull","grytor"]},
	{"main":"leksaker","sub":["lego","robotar","barbie","klossar"]},
	{"main":"väskor","sub":["ryggsäck","tygkasse","midjeväska","portfölj"]},
	{"main":"skulptur","sub":["modernt","religöst","epok"]},
	{"main":"labb","sub":["provrör","brännare","apparater","tänger"]},
	{"main":"sybehör","sub":["nål","tråd","dynor","garn"]},
	{"main":"sport","sub":["badminton","dart","simning","bollar"]},
	{"main":"lampor","sub":["lampskärm","taklampor","golvlampor","vägglampor"]},
	{"main":"sjukhus","sub":["förband","anatomi","operation","apparater"]}
]})
departments_dict.update({"möbel" : [
	{"main":"växt","sub":["palm","träd","murgröna","lösa blad"]},
	{"main":"stol","sub":["kontorsstol","stapelstol","stol epok","tronstol","pall","barpall"]},
	{"main":"fåtölj","sub":["gammal fåtölj","ny fotölj"]},
	{"main":"soffa","sub":["gammal soffa","ny soffa","pinnsoffa","kökssoffa"]},
	{"main":"säng","sub":["sängbotten","träsäng","madrass","sänggavel","fällsäng","militärsäng"]},
	{"main":"spegel","sub":["golvspegel","väggspegel","sminkspegel"]},
	{"main":"djur","sub":["älghuvud","bisonhuvud","renhuvud","ren","får","orre","påfågel"]},
	{"main":"skåp","sub":["byrå","klädskåp","vitrinskåp","bokhylla"]},
	{"main":"bar","sub":["stor bar","liten bar","jordglobsbar"]},
	{"main":"kök/badrum","sub":["toastol","handfat","badkar","badrumsskåp","köksskåp","köksö","kryddhylla"]},
	{"main":"bord","sub":["sängbord","soffbord","matbord","drinkvagnar"]},
	{"main":"sport","sub":["plintar","mattor","studsmattor"]},
	{"main":"militär","sub":["gasmaskar","hjälmar","militärtelefon","ryggsäckar"]},
	{"main":"orient","sub":["bord","skåp","lyktor","kamelsadel"]},
	{"main":"skola","sub":["bänkar","stolar","griffeltavlor"]},
	{"main":"brand","sub":["brandslang","brandspruta","brandhinkar"]},
	{"main":"podier","sub":["stora","små"]},
	{"main":"begravning","sub":["kistor","kors","gravstenar"]},
	{"main":"vitvaror","sub":["kylskåp","diskmaskin","spis","micro"]},
	{"main":"verktyg","sub":["snickarbänk","kedjor","verktygsväskor","elverktyg"]},
	{"main":"dörr","sub":["dubbeldörr","enkeldörr","ladugård"]},
	{"main":"teknikskrot","sub":["proppskåp","elmätare","kontrollbord"]},
	{"main":"fordon","sub":["biltillbehör","moped","minimoped","cykel"]}
]})
departments_dict.update({"kostym" : [
	{"main":"antiken", "code":"a"},
	{"main":"medeltiden", "code":"b"},
	{"main":"1500-1600", "code":"c"},
	{"main":"1600-1715", "code":"d"},
	{"main":"1715-1770", "code":"e"},
	{"main":"1770-1800", "code":"f"},
	{"main":"1800-1830", "code":"g"},
	{"main":"1830-1850", "code":"h"},
	{"main":"1850-1870", "code":"i"},
	{"main":"1870-1890", "code":"j"},
	{"main":"1900", "code":"k"},
	{"main":"1910", "code":"l"},
	{"main":"1920", "code":"m"},
	{"main":"1930", "code":"n"},
	{"main":"1940", "code":"o"},
	{"main":"1950", "code":"p"},
	{"main":"1960", "code":"q"},
	{"main":"1970", "code":"r"},
	{"main":"1980", "code":"s"},
	{"main":"1990", "code":"t"},
	{"main":"2000", "code":"00"},
	{"main":"2010", "code":"10"},
	{"main":"folkdräkt", "code":"u"},
	{"main":"underhållning", "code":"v"},
	{"main":"liturgiskt", "code":"x"},
	{"main":"yrke", "code":"y"},
	{"main":"militäruniformer", "code":"z"},
	{"main":"sport", "code":"å"},
	{"main":"yrke-allmänt", "code":"ä"},
	{"main":"patinerat", "code":"ö"}
]})
types = [
	{"main":"byxa", "code":"100"},
	{"main":"kjol", "code":"150"},
	{"main":"kavaj", "code":"205"},
	{"main":"jacka", "code":"220"},
	{"main":"väst", "code":"260"},
	{"main":"kostym hel", "code":"305"},
	{"main":"kostym utan väst", "code":"307"},
	{"main":"frack", "code":"320"},
	{"main":"klänning", "code":"405"},
	{"main":"kappa", "code":"505"},
	{"main":"pyjamas", "code":"660"},
	{"main":"rock", "code":"605"},
	{"main":"päls", "code":"690"},
	{"main":"blus", "code":"705"},
	{"main":"huvudbonad", "code":"800"},
	{"main":"fotbeklädnad", "code":"850"},
	{"main":"övrigt", "code":"900"}
]
sizes = [
	{"main":"dam","code":"2","sub":["34","36","38","40","42","44","46"]},
	{"main":"herr","code":"1","sub":["46","48","50","52","54","56","58"]},
	{"main":"pojk","code":"3","sub":["98","104","110","116","122","128","140","152"]},
	{"main":"flick","code":"4","sub":["98","104","110","116","122","128","140","152"]}
]
colors = ["beige","blå","brun","grå","grön","gul","lila","orange","rosa","röd","svart","vit"]
materials = ["trä","plast","papp","metall","stål","textil","glas","porslin","sten","gummi","betong"]
locations = ["A1","A2","A3","B1","B2","B3"]
images = ["katt1.jpg"]

template = {
	"id":0,
	"department":"",		
	"mainCategory":"",
	"subCategory":"",
	"priceGroup":1,					
	"color":"",
	#"material":[],				
	"available":True,					
	"rentalDate":None,
	"location":None,
	"individual":True,
	"image":"",
	"quantity":0,
	"quantityMax":0
}

container = {}
count = 0
now = datetime.datetime.now().isoformat()
amount = int(sys.argv[1]) if len(sys.argv)>1 else 2

for x in range(0,amount):
	new = template.copy()
	new["department"] = departments[randint(0,2)]
	categories = departments_dict[new["department"]]
	category_number = randint(0, len(categories)-1)
	
	new["mainCategory"] = categories[category_number]["main"]
	if new["department"] != "kostym":
		subs = categories[category_number]["sub"]
		new["subCategory"] = subs[randint(0,len(subs)-1)]
		#Kan lägga på fler material med append
		new["material"] = materials[randint(0, len(materials)-1)] #[] #list(template["material"])
		#new["material"].append(materials[count % len(materials)-1])
		#if randint(0,1) == 1:
		#	new["material"].append(materials[(count+randint(0,2)) % len(materials)-1])
	else:
		types_number = randint(0,len(types)-1)
		new["subCategory"] = types[types_number]["main"]
		gender_number = randint(0,len(sizes)-1)
		new["gender"] = sizes[gender_number]["main"]
		size_category = sizes[gender_number]["sub"]
		new["size"] = size_category[randint(0,len(size_category)-1)]
		new["code"] = "c-{0} {1}-{2}-{3}".format(new["size"],categories[category_number]["code"],sizes[gender_number]["code"],types[types_number]["code"])

	new["quantityMax"] = randint(1, 5)
	new["quantity"] = randint(0, new["quantityMax"])
	new["individual"] = True if new["quantityMax"] == 1 else False
	new["available"] = True if new["quantity"] > 0 else False
	new["location"] = locations[randint(0,len(locations)-1)] if new["available"] == False else None
	new["rentalDate"] = str(random_last_year_date()) if new["available"] == False else None

	new["priceGroup"] = randint(1,25)
	new["color"] = colors[count % len(colors)]

	new["image"] = images[0]

	new["id"] = count
	container.update({str(count):new})
	count += 1
	pass

with open('workfile.json', 'w') as outfile:
	json.dump([container], outfile, indent=2)

print("Done!")
