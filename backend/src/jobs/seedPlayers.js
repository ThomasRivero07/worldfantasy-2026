import dotenv from 'dotenv';
dotenv.config();
import { connectPostgres } from '../config/db.js';
import Player from '../models/Player.model.js';

const assignPrices = (players, position) => {
  const basePrices = {
    Goalkeeper: [9.0, 6.5, 5.5],
    Defender:   [9.5, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.5, 5.5, 5.5, 5.5],
    Midfielder: [12.0, 10.5, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.5, 6.5],
    Attacker:   [15.0, 13.0, 11.0, 10.0, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5],
  };
  return players.map((name, i) => ({
    name,
    position,
    fantasy_price: basePrices[position][Math.min(i, basePrices[position].length - 1)]
  }));
};

const squads = {
  'México': {
    group: 'A', conf: 'HOST',
    gk: ['Guillermo Ochoa','Raúl Rangel','Carlos Acevedo'],
    df: ['Edson Álvarez','Jorge Sánchez','César Montes','Johan Vásquez','Israel Reyes','Jesús Gallardo','Mateo Chávez'],
    mf: ['Obed Vargas','Álvaro Fidalgo','Luis Chávez','Orbelín Pineda','Brian Gutiérrez','Luis Romo','Erik Lira','Gilberto Mora'],
    at: ['Santiago Giménez','Raúl Jiménez','Chucky Lozano','Roberto Alvarado','César Huerta','Julián Quiñones','Alexis Vega','Armando González'],
  },
  'Sudáfrica': {
    group: 'A', conf: 'CAF',
    gk: ['Ronwen Williams','Sipho Chaine','Renaldo Leaner'],
    df: ['Grant Kekana','Nkosinathi Sibisi','Tapelo Xoki','Khuliso Mudau','Aubrey Modiba','Mothobi Mvala','Thabiso Sesane'],
    mf: ['Teboho Mokoena','Patrick Maswanganyi','Thalente Mbatha','Mihlali Mayambela','Sphephelo Sithole','Grant Margeman'],
    at: ['Lyle Foster','Evidence Makgopa','Oswin Appollis','Iqraam Rayners','Relebohile Mofokeng','Elias Mokwana'],
  },
  'Corea del Sur': {
    group: 'A', conf: 'AFC',
    gk: ['Kim Seung-gyu','Jo Hyeon-woo','Song Bum-keun'],
    df: ['Kim Min-jae','Cho Yu-min','Kim Moon-hwan','Lee Ki-hyuk','Park Jin-seob','Seol Young-woo','Lee Myung-jae'],
    mf: ['Lee Jae-sung','Hwang In-beom','Lee Kang-in','Bae Jun-ho','Hong Hyun-seok','Jung Ho-yeon','Paik Seung-ho','Jens Castrop'],
    at: ['Son Heung-min','Jeong Woo-yeong','Cho Gue-sung','Oh Hyeon-gyu','Yang Hyun-jun'],
  },
  'República Checa': {
    group: 'A', conf: 'UEFA',
    gk: ['Matej Kovar','Jindrich Stanek','Lukas Hornicek'],
    df: ['Robin Hranac','Vladimir Coufal','Ladislav Krejci','David Jurasek','Tomas Holes','David Zima','Stepan Chaloupek','Jaroslav Zeleny','David Doudera'],
    mf: ['Tomas Soucek','Lukas Provod','Lukas Cerv','Michal Sadilek','Alexandr Sojka','Hugo Sochurek','Vladimir Darida'],
    at: ['Patrik Schick','Adam Hlozek','Pavel Sulc','Mojmir Chytil','Jan Kuchta','Denis Visinsky','Tomas Chory'],
  },
  'Canadá': {
    group: 'B', conf: 'HOST',
    gk: ['Maxime Crepeau','Dayne St. Clair','Owen Goodman'],
    df: ['Alphonso Davies','Alistair Johnston','Moise Bombito','Derek Cornelius','Joel Waterman','Luc De Fougerolles','Alfie Jones','Richie Laryea','Niko Sigur'],
    mf: ['Stephen Eustaquio','Jonathan Osorio','Ismael Kone','Jacob Shaffelburg','Marcelo Flores','Nathan Saliba','Liam Millar','Mathieu Choiniere'],
    at: ['Jonathan David','Cyle Larin','Tajon Buchanan','Tani Oluwaseyi','Promise David','Ali Ahmed'],
  },
  'Bosnia y Herzegovina': {
    group: 'B', conf: 'UEFA',
    gk: ['Osman Hadzikic','Nikola Vasilj','Martin Zlomislic'],
    df: ['Sead Kolasinac','Amar Dedic','Dennis Hadzikadunic','Nikola Katic','Tarik Muharemovic','Nihad Mujakic','Stjepan Radeljic','Nidal Celik'],
    mf: ['Benjamin Tahirovic','Amir Hadziahmetovic','Ivan Sunjic','Esmir Bajraktarevic','Ivan Basic','Dzenis Burnic','Armina Gigovic','Ermin Mahmic','Amar Memic','Kerim Alajbegovic'],
    at: ['Ermedin Demirovic','Edin Dzeko','Haris Tabakovic','Samed Bazdar','Jovo Lukic'],
  },
  'Qatar': {
    group: 'B', conf: 'AFC',
    gk: ['Meshaal Barsham','Mahmoud Abunada','Salah Zakaria'],
    df: ['Pedro Miguel','Boualem Khoukhi','Homam Ahmed','Lucas Mendes','Jassem Gaber','Issa Laye','Ayoub Aloui','Sultan Albrake','Alhashmi Alhussein'],
    mf: ['Assim Madibo','Karim Boudiaf','Abdulaziz Hatem','Ahmed Alganehi','Ahmed Fathy'],
    at: ['Akram Afif','Almoez Ali','Hassan Alhaydos','Edmilson Junior','Ahmed Alaaeldin','Mohammed Muntari','Yusuf Abdurisag','Tahsin Jamshid','Mohamed Manai'],
  },
  'Suiza': {
    group: 'B', conf: 'UEFA',
    gk: ['Gregor Kobel','Yvon Mvogo','Marvin Keller'],
    df: ['Manuel Akanji','Ricardo Rodríguez','Nico Elvedi','Silvan Widmer','Aurele Amenda','Eray Comert','Luca Jaquez','Miro Muheim'],
    mf: ['Granit Xhaka','Remo Freuler','Ardon Jashari','Denis Zakaria','Djibril Sow','Zeki Amdouni','Fabian Rieder','Michel Aebischer'],
    at: ['Breel Embolo','Noah Okafor','Dan Ndoye','Ruben Vargas','Christian Fassnacht','Cedric Itten','Johan Manzambi'],
  },
  'Brasil': {
    group: 'C', conf: 'CONMEBOL',
    gk: ['Alisson','Ederson','Weverton'],
    df: ['Marquinhos','Gabriel Magalhães','Bremer','Alex Sandro','Danilo','Wesley','Leo Pereira','Douglas Santos','Ibañez'],
    mf: ['Bruno Guimarães','Lucas Paquetá','Casemiro','Fabinho','Danilo Santos'],
    at: ['Vinicius Junior','Raphinha','Neymar Junior','Endrick','Gabriel Martinelli','Matheus Cunha','Rayan','Luiz Henrique','Igor Thiago'],
  },
  'Marruecos': {
    group: 'C', conf: 'CAF',
    gk: ['Yassine Bounou','Munir El Kajoui','Reda Tagnaouti'],
    df: ['Achraf Hakimi','Noussair Mazraoui','Nayef Aguerd','Issa Diop','Chadi Riad','Anass Salah-Eddine','Zakaria El Ouahdi','Youssef Belammari','Redouane Halhal'],
    mf: ['Sofyan Amrabat','Bilal El Khannouss','Azzedine Ounahi','Ismael Saibari','Neil El Aynaoui','Ayyoub Bouaddi','Samir El Mourabet'],
    at: ['Brahim Diaz','Ayoub El Kaabi','Soufiane Rahimi','Abde Ezzalzouli','Chemsdine Talbi','Gessime Yassine','Ayoube Amaimouni'],
  },
  'Haití': {
    group: 'C', conf: 'CONCACAF',
    gk: ['Josué Duverger','Alexandre Pierre','Johny Placide'],
    df: ['Jean-Kévin Duverne','Hannes Delcroix','Carlens Arcus','Ricardo Adé','Wilguens Paugain','Martin Expérience','Duke Lacroix','Keeto Thermoncy'],
    mf: ['Jean-Ricner Bellegarde','Danley Jean Jacques','Carl Fred Sainte','Leverton Pierre','Woodensky Pierre','Dominique Simon'],
    at: ['Wilson Isidor','Frantzdy Pierrot','Duckens Nazon','Josué Casimir','Yassin Fortuné','Lenny Joseph','Derrick Etienne Jr.','Ruben Providence','Louicius Deedson'],
  },
  'Escocia': {
    group: 'C', conf: 'UEFA',
    gk: ['Craig Gordon','Angus Gunn','Liam Kelly'],
    df: ['Andy Robertson','Kieran Tierney','John Souttar','Grant Hanley','Aaron Hickey','Nathan Patterson','Jack Hendry','Scott McKenna','Dom Hyam','Anthony Ralston'],
    mf: ['Scott McTominay','John McGinn','Lewis Ferguson','Ryan Christie','Kenny McLean','Ben Gannon-Doak','Findlay Curtis','Tyler Fletcher'],
    at: ['Lawrence Shankland','Che Adams','Lyndon Dykes','Ross Stewart','George Hirst'],
  },
  'Estados Unidos': {
    group: 'D', conf: 'HOST',
    gk: ['Matt Turner','Matt Freese','Chris Brady'],
    df: ['Antonee Robinson','Sergino Dest','Chris Richards','Miles Robinson','Mark McKenzie','Joe Scally','Auston Trusty','Tim Ream','Alex Freeman','Max Arfsten'],
    mf: ['Christian Pulisic','Gio Reyna','Tyler Adams','Weston McKennie','Brenden Aaronson','Malik Tillman','Timothy Weah','Cristian Roldan','Sebastian Berhalter','Alejandro Zendejas'],
    at: ['Folarin Balogun','Ricardo Pepi','Haji Wright'],
  },
  'Paraguay': {
    group: 'D', conf: 'CONMEBOL',
    gk: ['Orlando Gill','Roberto Fernández','Gastón Olveira'],
    df: ['Gustavo Gómez','Junior Alonso','Fabián Balbuena','Omar Alderete','Juan Cáceres','José Canale','Alexandro Maidana','Gustavo Velázquez'],
    mf: ['Miguel Almirón','Andrés Cubas','Diego Gómez','Braian Ojeda','Damián Bobadilla','Matías Galarza','Alejandro Gamarra','Mauricio Magalhães'],
    at: ['Julio Enciso','Antonio Sanabria','Ramón Sosa','Gabriel Ávalos','Alex Arce','Gustavo Caballero','Isidro Pitta'],
  },
  'Australia': {
    group: 'D', conf: 'AFC',
    gk: ['Mathew Ryan','Paul Izzo','Patrick Beach'],
    df: ['Harry Souttar','Aziz Behich','Milos Degenek','Cameron Burgess','Jason Geria','Alessandro Circati','Jordan Bos','Jacob Italiano','Lucas Herrington','Kai Trewin'],
    mf: ['Jackson Irvine','Ajdin Hrustic','Cameron Devlin','Aiden ONeil','Connor Metcalfe','Paul Okon-Engstler'],
    at: ['Mathew Leckie','Nestory Irankunda','Cristian Volpato','Tete Yengi','Awer Mabil','Mohamed Toure','Nishan Velupillay'],
  },
  'Turquía': {
    group: 'D', conf: 'UEFA',
    gk: ['Mert Gunok','Altay Bayindir','Ugurcan Cakir'],
    df: ['Merih Demiral','Ferdi Kadioglu','Zeki Celik','Abdulkerim Bardakci','Caglar Soyuncu','Muldur','Kabak','Samet Akaydin','Elmali'],
    mf: ['Hakan Calhanoglu','Arda Guler','Kokcu','Yuksek','Ayhan','Ozcan'],
    at: ['Kenan Yildiz','Baris Yilmaz','Uzun','Kahveci','Akturkoglu','Gul','Aydin','Akgun'],
  },
  'Alemania': {
    group: 'E', conf: 'UEFA',
    gk: ['Manuel Neuer','Alexander Nübel','Oliver Baumann'],
    df: ['Antonio Rüdiger','Joshua Kimmich','Nico Schlotterbeck','Jonathan Tah','David Raum','Waldemar Anton','Malick Thiaw','Nathaniel Brown'],
    mf: ['Florian Wirtz','Jamal Musiala','Leroy Sané','Leon Goretzka','Pascal Groß','Aleksandar Pavlovic','Jamie Leweling','Nadiem Amiri','Felix Nmecha','Angelo Stiller','Lennart Karl'],
    at: ['Kai Havertz','Maximilian Beier','Deniz Undav','Nick Woltemade'],
  },
  'Curazao': {
    group: 'E', conf: 'CONCACAF',
    gk: ['Eloy Room','Trevor Doornbusch','Tyrick Bodack'],
    df: ['Armando Obispo','Riechedly Bazoer','Shurandy Sambo','Joshua Brenet','Roshon van Eijma','Sherel Floranus','Deveron Fonville','Jurien Gaari'],
    mf: ['Leandro Bacuna','Juninho Bacuna','Tyrese Noslin','Livano Comenencia','Arjany Martha','Kevin Felida','Godfried Roemeratoe'],
    at: ['Tahith Chong','Jurgen Locadia','Sontje Hansen','Kenji Gorre','Jeremy Antonisse','Gervane Kastaneer','Brandley Kuwas','Jearl Margaritha'],
  },
  'Costa de Marfil': {
    group: 'E', conf: 'CAF',
    gk: ['Alban Lafont','Mohamed Kone','Yahia Fofana'],
    df: ['Evan Ndicka','Odilon Kossounou','Ousmane Diomande','Ghislain Konan','Wilfried Singo','Emmanuel Agbadou','Guela Doue','Christopher Operi'],
    mf: ['Franck Kessie','Seko Fofana','Ibrahim Sangare','Jean Michael Seri','Parfait Guiagon','Christ Inao Oulai'],
    at: ['Amad Diallo','Nicolas Pepe','Simon Adingra','Ange-Yoan Bonny','Yan Diomande','Elye Wahi','Evann Guessand','Oumar Diakite','Bazoumana Toure'],
  },
  'Ecuador': {
    group: 'E', conf: 'CONMEBOL',
    gk: ['Hernán Galíndez','Moisés Ramírez','Gonzalo Valle'],
    df: ['Piero Hincapié','Willian Pacho','Pervis Estupiñán','Félix Torres','Ángelo Preciado','Joel Ordóñez','Jackson Porozo','Yaimar Medina'],
    mf: ['Moisés Caicedo','Kendry Páez','Gonzalo Plata','Alan Franco','Pedro Vite','Denil Castillo','Jordy Alcívar','John Yeboah','Nilson Angulo','Alan Minda'],
    at: ['Enner Valencia','Kevin Rodríguez','Jordy Caicedo','Anthony Valencia','Jeremy Arévalo'],
  },
  'Países Bajos': {
    group: 'F', conf: 'UEFA',
    gk: ['Bart Verbruggen','Mark Flekken','Robin Roefs'],
    df: ['Virgil van Dijk','Jurrien Timber','Nathan Ake','Micky van de Ven','Denzel Dumfries','Jan-Paul van Hecke','Mats Wieffer','Jorrel Hato'],
    mf: ['Frenkie de Jong','Tijjani Reijnders','Teun Koopmeiners','Ryan Gravenberch','Quinten Timber','Justin Kluivert','Marten de Roon','Guus Til'],
    at: ['Cody Gakpo','Memphis Depay','Donyell Malen','Brian Brobbey','Wout Weghorst','Noa Lang','Crysencio Summerville'],
  },
  'Japón': {
    group: 'F', conf: 'AFC',
    gk: ['Zion Suzuki','Keisuke Osako','Tomoki Hayakawa'],
    df: ['Ko Itakura','Takehiro Tomiyasu','Hiroki Ito','Yukinari Sugawara','Tsuyoshi Watanabe','Shogo Taniguchi','Yuto Nagatomo','Ayumu Seko','Junnosuke Suzuki'],
    mf: ['Takefusa Kubo','Daichi Kamada','Wataru Endo','Ao Tanaka','Ritsu Doan','Junya Ito','Kaishu Sano','Keito Nakamura'],
    at: ['Ayase Ueda','Daizen Maeda','Koki Ogawa','Keisuke Goto','Yuito Suzuki','Kento Shiogai'],
  },
  'Suecia': {
    group: 'F', conf: 'UEFA',
    gk: ['Jacob Zetterstrom','Viktor Johansson','Gustaf Lagerbielke'],
    df: ['Victor Lindelof','Isak Hien','Carl Starfelt','Gabriel Gudmundsson','Hjalmar Ekdal','Daniel Svensson','Eric Smith'],
    mf: ['Dejan Kulusevski','Lucas Bergvall','Mattias Svanberg','Yasin Ayari','Ken Sema','Jesper Karlstrom','Benjamin Nygren','Besfort Zeneli','Elliot Stroud'],
    at: ['Viktor Gyokeres','Alexander Isak','Anthony Elanga','Alexander Bernhardsson','Gustaf Nilsson','Taha Ali'],
  },
  'Túnez': {
    group: 'F', conf: 'CAF',
    gk: ['Aymen Dahmene','Sabri Ben Hassan','Abdelmouhib Chamakh'],
    df: ['Montassar Talbi','Dylan Bronn','Ali Abdi','Yan Valery','Omar Rekik','Adem Arous','Moutaz Neffati','Raed Chikhaoui','Mohamed Amine Ben Hamida'],
    mf: ['Ellyes Skhiri','Hannibal Mejbri','Anis Ben Slimane','Rani Khedira','Ismail Gharbi','Hadj Mahmoud','Mortadha Ben Ouanes'],
    at: ['Khalil Ayari','Sebastian Tounekti','Elias Achouri','Elias Saad','Rayan Elloumi','Hazem Mastouri','Firas Chaouat'],
  },
  'Bélgica': {
    group: 'G', conf: 'UEFA',
    gk: ['Thibaut Courtois','Senne Lammens','Mike Penders'],
    df: ['Zeno Debast','Arthur Theate','Maxim De Cuyper','Timothy Castagne','Brandon Mechele','Thomas Meunier','Koni De Winter','Joaquin Seys','Nathan Ngoy'],
    mf: ['Kevin De Bruyne','Amadou Onana','Youri Tielemans','Alexis Saelemaekers','Hans Vanaken','Nicolas Raskin','Diego Moreira','Axel Witsel'],
    at: ['Romelu Lukaku','Jeremy Doku','Leandro Trossard','Charles De Ketelaere','Dodi Lukebakio','Matias Fernandez-Pardo'],
  },
  'Egipto': {
    group: 'G', conf: 'CAF',
    gk: ['Mohamed Elshenawy','Mahdy Soliman','Mostafa Shoubir'],
    df: ['Yasser Ibrahim','Mohamed Hany','Ramy Rabia','Mohamed Abdelmoneim','Hossam Abdelmaguid','Ahmed Fatouh','Karim Hafez','Tarek Alaa'],
    mf: ['Omar Marmoush','Emam Ashour','Hamdy Fathy','Mostafa Zico','Mohanad Lashin','Marawan Attia','Nabil Donga','Mahmoud Saber'],
    at: ['Mohamed Salah','Trezeguet','Hamza Abdelkarim','Ibrahim Adel','Haissem Hassan','Zizo'],
  },
  'Irán': {
    group: 'G', conf: 'AFC',
    gk: ['Alireza Beiranvand','Hossein Hosseini','Payam Niazmand'],
    df: ['Ehsan Hajsafi','Shoja Khalilzadeh','Milad Mohammadi','Ramin Rezaeian','Hossein Kanaani','Daniyal Eiri','Saleh Hardani','Ali Nemati'],
    mf: ['Saeid Ezatolahi','Alireza Jahanbakhsh','Saman Ghoddos','Mehdi Ghayedi','Rouzbeh Cheshmi','Mohammad Mohebi','Mehdi Torabi','Mohammad Ghorbani','Aria Yousefi'],
    at: ['Mehdi Taremi','Sardar Azmoun','Ali Alipour','Dennis Dargahi','Amirhossein Hosseinzadeh','Shahriar Moghanlou'],
  },
  'Nueva Zelanda': {
    group: 'G', conf: 'OFC',
    gk: ['Michael Woud','Alex Paulsen','Max Crocombe'],
    df: ['Michael Boxall','Liberato Cacace','Tommy Smith','Nando Pijnaker','Tyler Bindon','Tim Payne','Francis de Vries','Callan Elliot','Finn Surman'],
    mf: ['Marko Stamenic','Ryan Thomas','Callum McCowatt','Joe Bell','Ben Old','Alex Rufer','Matt Garbett','Eli Just','Sarpreet Singh','Lachlan Bayliss'],
    at: ['Chris Wood','Kosta Barbarouses','Ben Waine','Jesse Randall'],
  },
  'España': {
    group: 'H', conf: 'UEFA',
    gk: ['Unai Simón','David Raya','Joan Garcia'],
    df: ['Alejandro Grimaldo','Pau Cubarsí','Aymeric Laporte','Marc Cucurella','Pedro Porro','Marcos Llorente','Eric Garcia','Marc Pubill'],
    mf: ['Pedri','Rodri','Gavi','Dani Olmo','Fabián Ruiz','Martín Zubimendi','Mikel Merino','Álex Baena'],
    at: ['Lamine Yamal','Nico Williams','Mikel Oyarzabal','Ferran Torres','Yeremy Pino','Víctor Muñoz','Borja Iglesias'],
  },
  'Arabia Saudita': {
    group: 'H', conf: 'AFC',
    gk: ['Mohammed Alowais','Nawaf Alaqidi','Ahmed Alkassar'],
    df: ['Saud Abdulhamid','Ali Lajami','Hassan Altambakti','Ali Majrashi','Abdulelah Alamri','Nawaf Bu Washl','Hassan Kadish','Moteb Alharbi','Jehad Thikri','Mohammed Abu Alshamat'],
    mf: ['Salem Aldawsari','Nasser Aldawsari','Mohamed Kanno','Musab Aljuwayr','Abdullah Alkhaibari','Ziyad Aljohani','Ala Alhajji'],
    at: ['Feras Albrikan','Saleh Alshehri','Aiman Yahya','Abdullah Alhamddan','Sultan Mandash','Khalid Alghannam'],
  },
  'Uruguay': {
    group: 'H', conf: 'CONMEBOL',
    gk: ['Sergio Rochet','Fernando Muslera','Santiago Mele'],
    df: ['Ronald Araujo','José María Giménez','Mathías Olivera','Santiago Bueno','Guillermo Varela','Sebastián Cáceres','Joaquín Piquerez','Matías Viña'],
    mf: ['Federico Valverde','Manuel Ugarte','Rodrigo Bentancur','Giorgian de Arrascaeta','Nicolás de la Cruz','Emiliano Martínez','Facundo Pellistri','Maximilliano Araújo','Agustín Canobbio','Rodrigo Zalazar','Brian Rodríguez','Juan Manuel Sanabria'],
    at: ['Darwin Núñez','Rodrigo Aguirre','Federico Viñas'],
  },
  'Cabo Verde': {
    group: 'H', conf: 'CAF',
    gk: ['Vozinha','Márcio Rosa','CJ dos Santos'],
    df: ['Logan Costa','Ianique Stopira','Steven Moreira','Pico Lopes','Wagner Pina','Joao Paulo Fernandes','Sidny Cabral','Kelvin Pires','Diney Borges'],
    mf: ['Jamiro Monteiro','Laros Duarte','Deroy Duarte','Yannick Semedo','Telmo Arcanjo','Kevin Pina'],
    at: ['Garry Rodrigues','Jovane Cabral','Ryan Mendes','Nuno da Costa','Willy Semedo','Dailon Livramento','Gilson Benchimol','Hélio Varela'],
  },
  'Francia': {
    group: 'I', conf: 'UEFA',
    gk: ['Mike Maignan','Brice Samba','Robin Risser'],
    df: ['William Saliba','Jules Koundé','Dayot Upamecano','Theo Hernandez','Ibrahima Konate','Lucas Hernandez','Malo Gusto','Lucas Digne','Maxence Lacroix'],
    mf: ['N Golo Kante','Aurelien Tchouameni','Adrien Rabiot','Warren Zaire-Emery','Manu Kone'],
    at: ['Kylian Mbappe','Ousmane Dembele','Marcus Thuram','Bradley Barcola','Michael Olise','Desire Doue','Rayan Cherki','Jean-Philippe Mateta','Maghnes Akliouche'],
  },
  'Senegal': {
    group: 'I', conf: 'CAF',
    gk: ['Edouard Mendy','Yehvann Diouf','Mory Diaw'],
    df: ['Kalidou Koulibaly','El Hadji Malick Diouf','Krepin Diatta','Moussa Niakhate','Antoine Mendy','Ismail Jakobs','Mamadou Sarr','Abdoulaye Seck'],
    mf: ['Pape Matar Sarr','Lamine Camara','Nicolas Jackson','Idrissa Gana Gueye','Pape Gueye','Bara Sapoko Ndiaye','Habib Diarra','Pathe Ciss'],
    at: ['Sadio Mané','Ismaila Sarr','Iliman Ndiaye','Assane Diao','Bamba Dieng','Ibrahim Mbaye','Cherif Ndiaye'],
  },
  'Irak': {
    group: 'I', conf: 'AFC',
    gk: ['Talib','Hassan','Basil'],
    df: ['Ali','Younis','Tahseen','Sulaka','Hashem','Doski','Yahya'],
    mf: ['Bashar Resan','Al Ammari','Yakob','Iqbal','Sher','Putros','Saadoon','Amyn','Bayesh'],
    at: ['Aymen Hussein','Farji','Jassim','AlHamadi','Youssef','Hussein Ali'],
  },
  'Noruega': {
    group: 'I', conf: 'UEFA',
    gk: ['Orjan Nyland','Egil Selvik','Sander Tangvik'],
    df: ['Kristoffer Ajer','Leo Ostigard','Fredrik Bjorkan','Marcus Holmgren Pedersen','Julian Ryerson','Torbjorn Heggem','Sondre Langas','David Moller Wolfe','Henrik Falchener'],
    mf: ['Martin Odegaard','Sander Berge','Antonio Nusa','Oscar Bobb','Fredrik Aursnes','Kristian Thorstvedt','Patrick Berg','Andreas Schjelderup','Morten Thorsby','Jens Petter Hauge','Thelonious Aasgaard'],
    at: ['Erling Haaland','Alexander Sorloth','Jorgen Strand Larsen'],
  },
  'Argentina': {
    group: 'J', conf: 'CONMEBOL',
    gk: ['Emiliano Martínez','Gerónimo Rulli','Juan Musso'],
    df: ['Cristian Romero','Lisandro Martínez','Nahuel Molina','Nicolás Otamendi','Nicolás Tagliafico','Leonardo Balerdi','Gonzalo Montiel','Facundo Medina'],
    mf: ['Enzo Fernández','Alexis Mac Allister','Rodrigo De Paul','Leandro Paredes','Exequiel Palacios','Giovani Lo Celso','Valentín Barco'],
    at: ['Lionel Messi','Lautaro Martínez','Julián Álvarez','Nicolás González','Giuliano Simeone','Thiago Almada','Nicolás Paz','José Manuel López'],
  },
  'Argelia': {
    group: 'J', conf: 'CAF',
    gk: ['Oussama Benbot','Melvin Mastil','Luca Zidane'],
    df: ['Ramy Bensebaïni','Aïssa Mandi','Rayan Aït-Nouri','Rafik Belghali','Jaouen Hadjam','Samir Chergui','Achref Abada','Zineddine Belaïd','Mohamed Tougaï'],
    mf: ['Ibrahim Maza','Houssem Aouar','Farès Chaïbi','Nabil Bentaleb','Hicham Boudaoui','Ramiz Zerrouki','Yacine Titraoui'],
    at: ['Riyad Mahrez','Mohamed Amoura','Amine Gouiri','Anis Hadj Moussa','Farès Ghedjemis','Nadhir Benbouali','Adil Boulbina'],
  },
  'Austria': {
    group: 'J', conf: 'UEFA',
    gk: ['Patrick Pentz','Alexander Schlager','Florian Wiegele'],
    df: ['David Alaba','Kevin Danso','Marco Friedl','Philipp Lienhart','Stefan Posch','Alexander Prass','Phillipp Mwene','David Affengruber','Michael Svoboda'],
    mf: ['Marcel Sabitzer','Christoph Baumgartner','Konrad Laimer','Nicolas Seiwald','Florian Grillitsch','Xaver Schlager','Romano Schmid','Carney Chukwuemeka','Paul Wanner','Alessandro Schopf','Patrick Wimmer'],
    at: ['Marko Arnautovic','Michael Gregoritsch','Sasa Kalajdzic'],
  },
  'Jordania': {
    group: 'J', conf: 'AFC',
    gk: ['Yazeed Abulaila','Abdallah Al-Fakhouri','Ahmad Al-Juaidi'],
    df: ['Ehsan Haddad','Mohammad Abu Hasheesh','Yazan Al-Arab','Baraa Marie','Abdallah Nasib','Salem Al-Ajalin','Husam Abu Dahab','Firas Shelbaya'],
    mf: ['Mousa Al-Tamari','Fadel Kalbouneh','Nizar Al-Rashdan','Noor Al-Rawabdeh','Rajaei Ayed','Ibrahim Sadeh','Yousef Abu Jalboush','Anas Al-Awadat','Mahmoud Al-Mardi','Mohammad Abu Zrayq','Saif Darwish'],
    at: ['Yazan Al-Naimat','Ali Olwan','Bahaa Faisal','Reziq Bani Hani'],
  },
  'Portugal': {
    group: 'K', conf: 'UEFA',
    gk: ['Diogo Costa','José Sá','Rui Silva'],
    df: ['Rúben Dias','João Cancelo','Nuno Mendes','Diogo Dalot','Gonçalo Inácio','Matheus Nunes','Nélson Semedo','Renato Veiga','Tomás Araújo'],
    mf: ['Bruno Fernandes','Bernardo Silva','Vitinha','João Neves','Rúben Neves','Samuel Costa'],
    at: ['Cristiano Ronaldo','Rafael Leão','Pedro Neto','Gonçalo Ramos','João Félix','Francisco Conceição','Francisco Trincão','Gonçalo Guedes'],
  },
  'RD Congo': {
    group: 'K', conf: 'CAF',
    gk: ['Matthieu Epolo','Lionel Mpasi','Thimothy Fayulu'],
    df: ['Chancel Mbemba','Aaron Wan-Bissaka','Arthur Masuaku','Alex Tuanzebe','Joris Kayembe','Steve Kapuadi','Dylan Batubinsika','Aaron Tshibola','Gedeon Kalulu'],
    mf: ['Yoane Wissa','Gael Kakuta','Meschack Elia','Ngalayel Mukau','Noah Sadiki','Edo Kayembe','Charles Pickel','Samuel Moutoussamy','Brian Cipenga','Nathanael Mbuku'],
    at: ['Cédric Bakambu','Simon Banza','Fiston Mayele','Theo Bongonda'],
  },
  'Uzbekistán': {
    group: 'K', conf: 'AFC',
    gk: ['Yusupov','Ergashev','Nematov'],
    df: ['Khusanov','Ashurmatov','Sayfiev','Eshmuradov','Nasrullaev','Urozov','Abdullaev','Ulmasaliev','Alijonov','Karimov'],
    mf: ['Masharipov','Fayzullaev','Shukurov','Hamrobekov','Ganiev','Mozgovoy','Esanov','Iskanderov'],
    at: ['Shomurodov','Uronov','Sergeev','Amonov','Khamdamov'],
  },
  'Colombia': {
    group: 'K', conf: 'CONMEBOL',
    gk: ['Camilo Vargas','David Ospina','Álvaro Montero'],
    df: ['Daniel Muñoz','Dávinson Sánchez','Jhon Lucumí','Yerry Mina','Johan Mojica','Santiago Arias','Déiver Machado','Willer Ditta'],
    mf: ['Luis Díaz','James Rodríguez','Richard Ríos','Jhon Arias','Jorge Carrascal','Juan Fernando Quintero','Jefferson Lerma','Kevin Castaño','Jaminton Campaz','Juan Portilla','Gustavo Puerta'],
    at: ['Juan Camilo Hernández','Luis Suárez','Jhon Córdoba','Carlos Gómez'],
  },
  'Inglaterra': {
    group: 'L', conf: 'UEFA',
    gk: ['Jordan Pickford','Dean Henderson','James Trafford'],
    df: ['Jude Bellingham','Reece James','John Stones','Marc Guehi','Ezri Konsa','Tino Livramento','Dan Burn','Jarell Quansah','Nico OReilly','Djed Spence'],
    mf: ['Declan Rice','Kobbie Mainoo','Eberechi Eze','Morgan Rogers','Elliott Anderson','Jordan Henderson'],
    at: ['Harry Kane','Bukayo Saka','Marcus Rashford','Anthony Gordon','Ollie Watkins','Ivan Toney','Noni Madueke'],
  },
  'Croacia': {
    group: 'L', conf: 'UEFA',
    gk: ['Dominik Livakovic','Dominik Kotarski','Ivor Pandur'],
    df: ['Josko Gvardiol','Josip Stanisic','Duje Caleta-Car','Marin Pongracic','Josip Sutalo','Kristijan Jakic','Luka Vuskovic','Martin Erlic'],
    mf: ['Luka Modric','Mateo Kovacic','Petar Sucic','Mario Pasalic','Nikola Vlasic','Martin Baturina','Luka Sucic','Nikola Moro','Toni Fruk'],
    at: ['Andrej Kramaric','Ivan Perisic','Ante Budimir','Petar Musa','Igor Matanovic','Marco Pasalic'],
  },
  'Ghana': {
    group: 'L', conf: 'CAF',
    gk: ['Lawrence Ati-Zigi','Benjamin Asare','Joseph Anang'],
    df: ['Alidu Seidu','Abdul Mumin','Gideon Mensah','Baba Abdul Rahman','Marvin Senaya','Jerome Opoku','Jonas Adjetey','Kojo Oppong Peprah','Derrick Luckassen'],
    mf: ['Mohammed Kudus','Thomas Partey','Abdul Fatawu Issahaku','Kamal Deen Sulemana','Augustine Boakye','Elisha Owusu','Caleb Yirenkyi','Kwasi Sibo'],
    at: ['Inaki Williams','Antoine Semenyo','Ernest Nuamah','Jordan Ayew','Brandon Thomas-Asante','Christopher Bonsu Baah','Prince Kwabena Adu'],
  },
  'Panamá': {
    group: 'L', conf: 'CONCACAF',
    gk: ['Luis Mejia','Cesar Samudio','Orlando Mosquera'],
    df: ['Amir Murillo','Fidel Escobar','Jose Cordoba','Cesar Blackman','Eric Davis','Andres Andrade','Carlos Harvey','Jiovany Ramos','Edgardo Farina','Roderick Miller','Jorge Gutierrez'],
    mf: ['Adalberto Carrasquilla','Ismael Diaz','Edgar Barcenas','Anibal Godoy','Jose Luis Rodriguez','Cristian Martinez','Alberto Quintero','Cesar Yanis'],
    at: ['Cecilio Waterman','Jose Fajardo','Tomas Rodriguez','Azarias Londono'],
  },
};

const seed = async () => {
  await connectPostgres();
  await Player.destroy({ where: {}, truncate: true });
  console.log('Limpiando jugadores anteriores...');

  let total = 0;
  for (const [teamName, squad] of Object.entries(squads)) {
    const players = [
      ...assignPrices(squad.gk, 'Goalkeeper'),
      ...assignPrices(squad.df, 'Defender'),
      ...assignPrices(squad.mf, 'Midfielder'),
      ...assignPrices(squad.at, 'Attacker'),
    ];

    for (const [i, p] of players.entries()) {
      await Player.create({
        api_id: `${teamName}-${p.position}-${i}-${p.name}`.replace(/\s/g,'_').replace(/[^a-zA-Z0-9_-]/g,'').toLowerCase().slice(0,80),
        name: p.name,
        nationality: teamName,
        team_name: teamName,
        team_group: squad.group,
        position: p.position,
        fantasy_price: p.fantasy_price,
        is_available: true,
      });
      total++;
    }
    process.stdout.write(`\r Cargados: ${total} jugadores...`);
  }

  console.log(`\n\n Total: ${total} jugadores de ${Object.keys(squads).length} selecciones`);
  process.exit(0);
};

seed().catch(err => { console.error('Error:', err.message); process.exit(1); });
