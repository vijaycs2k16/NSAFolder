var fs = require('fs');
var async = require('async');
var data = [
    {
        "schoolId": "cedc64fe-a787-11e8-98d0-529269fb1459",
        "schoolName": "MARKEZ"
    },
    {
        "schoolId": "0011abe9-6043-43b1-9f21-9b19d4d8453d",
        "schoolName": "Jayam Cbse School - Attur"
    },
    {
        "schoolId": "00154e1b-95d1-447f-8c9e-64fae39ae0ee",
        "schoolName": "E M Academy"
    },
    {
        "schoolId": "00288b5c-4277-4059-952c-856c1d6373ba",
        "schoolName": "CLUNEY MHS SCHOOL"
    },
    {
        "schoolId": "003d4198-5863-4944-a678-a1f6ff48e180",
        "schoolName": "Bhunawal Public School"
    },
    {
        "schoolId": "0058a3f6-c5c9-49c4-8e78-1c5f4c2fb0b0",
        "schoolName": "dayawati sc"
    },
    {
        "schoolId": "006a839a-5c6f-49bb-8d52-90d3f1378ee3",
        "schoolName": "Amudham Matric School- Madurai"
    },
    {
        "schoolId": "00740be2-fc04-4751-b5ac-62aadaf8ad70",
        "schoolName": "DARUL FALAH ENGLISH SCHOOL"
    },
    {
        "schoolId": "00af6211-02ea-43fd-a0c3-27bff362f87f",
        "schoolName": "Vignan vidyalaya"
    },
    {
        "schoolId": "00ed10ef-f773-4d9e-b150-022221c37df4",
        "schoolName": "BALLYGUNG PARK DAY"
    },
    {
        "schoolId": "00f7086b-42e7-425a-9097-2f801b300446",
        "schoolName": "Sanskar Int. School"
    },
    {
        "schoolId": "015788f2-db75-4061-870f-68276e37d9e2",
        "schoolName": "SARAH TUCKER MAT"
    },
    {
        "schoolId": "0184539a-55b5-4d90-ae12-0467028ea376",
        "schoolName": "Lisieux CMI International School"
    },
    {
        "schoolId": "01a81d94-58a1-471f-b2df-1ae2c89daf94",
        "schoolName": "Vidyathith Academy"
    },
    {
        "schoolId": "023a43d3-2501-4bfc-898a-bd36bc31abe3",
        "schoolName": "GLOBAL PROVIDENCE ACADEMY"
    },
    {
        "schoolId": "02bcb523-eb04-4221-be99-4812de71087a",
        "schoolName": "Knic"
    },
    {
        "schoolId": "02c77bfe-6c93-4e5e-a54f-53a6ca1fc11e",
        "schoolName": "V L S SCHOOL"
    },
    {
        "schoolId": "0366b185-3543-4633-be39-e4653d6867d1",
        "schoolName": "MARIA AGNUS - PERUMPUZHA - KOLLAM"
    },
    {
        "schoolId": "036aa056-899b-4597-b376-4fd9f9ce500e",
        "schoolName": "St Paul School"
    },
    {
        "schoolId": "03b0a09f-05dc-4b86-b92a-050c7499831e",
        "schoolName": "Chinsurah Eng. School"
    },
    {
        "schoolId": "03db9c67-daa9-404a-852c-2f8421b31c8a",
        "schoolName": "Carmel E.M. School- Thakazhi"
    },
    {
        "schoolId": "04263069-5de4-4c41-a863-c150c250fae3",
        "schoolName": "St.John's Matric Higher Secondary School - Tirunelveli"
    },
    {
        "schoolId": "0499596b-adad-4933-898b-b3ac5160c224",
        "schoolName": "VASAVI ENGLISH MEDIUMSCHOOL"
    },
    {
        "schoolId": "0509591c-36d4-423b-8192-240ef1019713",
        "schoolName": "HOLY ANGELS"
    },
    {
        "schoolId": "053e98d6-d2c9-4e8a-83c4-8c0794a895aa",
        "schoolName": "Chavara Vidhya Bhavan Matric. Hr. Sec. School-Cbe"
    },
    {
        "schoolId": "05471a7b-8ed2-49b2-ac18-fee3287024a3",
        "schoolName": "Domkal Model School"
    },
    {
        "schoolId": "05586f4f-d807-4d80-aaef-7ba6a343a98c",
        "schoolName": "Ravindra bharathi hyderabad"
    },
    {
        "schoolId": "056cf2e9-1da3-4347-aac8-b0db200ad59a",
        "schoolName": "KMC PUBLIC SCHOOL"
    },
    {
        "schoolId": "059373fb-8e40-4d6a-980a-99e274633e0a",
        "schoolName": "Rotary School - Madurai"
    },
    {
        "schoolId": "06229bb1-4f97-4ddf-8c4f-bdc9bacc5bda",
        "schoolName": "IQURA ENGLISH SCHOOL"
    },
    {
        "schoolId": "06406755-8389-44eb-8c36-225b5f430f35",
        "schoolName": "DONBOSCO MHS SCHOOL"
    },
    {
        "schoolId": "0640f61f-78f3-45b2-891d-f5c4049dc3eb",
        "schoolName": "Holy Home"
    },
    {
        "schoolId": "0687a715-3488-46ae-ad18-51400fc867df",
        "schoolName": "Shivalic Public School"
    },
    {
        "schoolId": "06ad26f2-d1fd-4320-ba94-a3f91ae8b1eb",
        "schoolName": "International Hindu School"
    },
    {
        "schoolId": "0707ea41-76bd-43d0-96cd-5dd207a8783e",
        "schoolName": "Chanakya Vidyasram"
    },
    {
        "schoolId": "07273824-6be5-48bc-95ed-53b26b90cd0e",
        "schoolName": "south point school"
    },
    {
        "schoolId": "07362fc1-29fc-4b1d-af11-60a34ced76f7",
        "schoolName": "Alfia Public School"
    },
    {
        "schoolId": "0739feb1-3d10-4e02-af90-220667dc042b",
        "schoolName": "Jijas Marry School"
    },
    {
        "schoolId": "07495468-d025-4055-af90-045e614a55f0",
        "schoolName": "BRIGHT ACADEMY"
    },
    {
        "schoolId": "077afb19-89ca-47b0-bd1e-1ac1f88b39ab",
        "schoolName": "Jaya Matric.Hr.Sec.School-"
    },
    {
        "schoolId": "079816e0-aba4-4504-8d4d-a03f609687f9",
        "schoolName": "Asian Public School"
    },
    {
        "schoolId": "07b512ae-fdcb-4877-90de-e9ca6b88744f",
        "schoolName": "Sunny Prep"
    },
    {
        "schoolId": "07eb68e4-b737-41cb-9b1d-31711fd58a1f",
        "schoolName": "Venkateswara School - Attur"
    },
    {
        "schoolId": "080f508c-5a61-4c2b-837d-84e5aa222fae",
        "schoolName": "Orange Kid School-Ayyapakkam"
    },
    {
        "schoolId": "0828ebd8-14fe-488b-9353-1a31a1b09367",
        "schoolName": "Kamarajar Matric. Hr. Sec. School - Thedavoor"
    },
    {
        "schoolId": "08716d02-efed-42f9-a719-4948cbe3a27e",
        "schoolName": "MOTHER MARY SCHOOL"
    },
    {
        "schoolId": "0895178c-ec90-44f6-8f0f-0549f8d10faf",
        "schoolName": "Netaji Public School"
    },
    {
        "schoolId": "08a25368-3ab2-40e1-8090-aace9ef0f748",
        "schoolName": "ARCH BISHOP ATTIPETTY PUBLIC SCHOOL"
    },
    {
        "schoolId": "094deed6-4d9b-44b5-96d6-2f3adb8e977e",
        "schoolName": "ST. THERESSA SCHOOL"
    },
    {
        "schoolId": "09dd01ef-7d70-4851-a140-400851eddc66",
        "schoolName": "INDIAN HIGH SCHOOL"
    },
    {
        "schoolId": "0a09c4b6-3137-44d4-bd6c-d0c448c92a92",
        "schoolName": "Shemford Futuristic School"
    },
    {
        "schoolId": "0a891787-c834-4ff5-9b10-66b3e725b11c",
        "schoolName": "VIVEKANANDA E.M SCHOOL"
    },
    {
        "schoolId": "0aa7055b-4ebf-4f31-a271-1bd8d7086578",
        "schoolName": "GEETHANJALI EM SCHOOL"
    },
    {
        "schoolId": "0ac435b4-d931-4bd5-937c-0176f42c342a",
        "schoolName": "ASHOKA INTERNATION SCHOOL"
    },
    {
        "schoolId": "0ae830e9-8ff2-4d6d-ad68-2c92605a17d0",
        "schoolName": "TRINITY LYCEUM- KOLLAM"
    },
    {
        "schoolId": "0b1177ef-57c3-466b-be96-167b7bc6d463",
        "schoolName": "Meridian Convent"
    },
    {
        "schoolId": "0b1b7e97-2843-4e92-979d-23a3fb17e645",
        "schoolName": "Zion School"
    },
    {
        "schoolId": "0b5c9c57-8faf-4bd7-b85e-f4e0328acd80",
        "schoolName": "Lords Public School - Karunagapally"
    },
    {
        "schoolId": "0bd06458-8e78-409e-94ff-4126fdf88bd4",
        "schoolName": "Pine Hall School"
    },
    {
        "schoolId": "0c1494cc-2cdd-4009-90ba-85e5c11e7074",
        "schoolName": "NATIONAL PUBLIC SCHOOL"
    },
    {
        "schoolId": "0c7dff10-25d9-44f0-b17d-23498535f36d",
        "schoolName": "S.N. Vidya Bhavan Sr. Sec. School - Thrissur"
    },
    {
        "schoolId": "0c82cf35-afad-486a-b9a4-e92fa0b6d6a6",
        "schoolName": "Jeevas public school"
    },
    {
        "schoolId": "0c911746-957c-49ab-87ad-74832c88e4ab",
        "schoolName": "VEDIC VIDYASHERAM"
    },
    {
        "schoolId": "0c987b4c-7b2f-45e6-8260-86c5c82fe77f",
        "schoolName": "NAMAKKAL KONGU MHS SCHOOL"
    },
    {
        "schoolId": "0cd153fb-7d83-42a0-a804-ead4c6241ecc",
        "schoolName": "K E T ENGLISH SCHOOL"
    },
    {
        "schoolId": "0cdcb3be-e0f9-44cf-8a28-bc88ba604a0a",
        "schoolName": "MOTHERS LAND HIGH SCHOOL"
    },
    {
        "schoolId": "0d0cc260-d8ff-4439-9eb5-098fff2d5a18",
        "schoolName": "Dolphin"
    },
    {
        "schoolId": "0db4126b-eff1-4386-9781-1b939f7e0caa",
        "schoolName": "GURUKUL GLOBAL SCHOOL"
    },
    {
        "schoolId": "0dc3f44c-1db6-46bf-94f8-86c214262715",
        "schoolName": "SPICE VALLEY CBSE SCHOOL"
    },
    {
        "schoolId": "0e31981f-fe15-45cb-b9f0-3042815a60e8",
        "schoolName": "ST:MARYS ENGLISH SCHOOL"
    },
    {
        "schoolId": "0e6188be-eeee-47b8-ba16-3c906ea7c81c",
        "schoolName": "VADHI HUSNA PUBLIC SCHOOL"
    },
    {
        "schoolId": "0e83704f-20e8-443b-888c-9b67638df7a2",
        "schoolName": "ST.PAUL'S E.M SCHOOL"
    },
    {
        "schoolId": "0e8a4c11-7048-41ef-86cf-b698539b112f",
        "schoolName": "TULIP CBSE SCHOOL"
    },
    {
        "schoolId": "0e8d3d0e-7007-4eff-82f1-430eab768a6e",
        "schoolName": "Mewa Public School"
    },
    {
        "schoolId": "0f225803-417a-4d13-8c77-d5e6e0bfc4fa",
        "schoolName": "ST.ANNS SENIOR SECONDERY"
    },
    {
        "schoolId": "0f337c7e-1e42-449d-be34-588fc328a67e",
        "schoolName": "Saraswathi Ramachandran Vidyalaya Matric. Hr. Sec. School - Cbe"
    },
    {
        "schoolId": "0f8adfdc-996b-4502-95fd-417fd3e611fc",
        "schoolName": "I.N.S. Public School"
    },
    {
        "schoolId": "0fa688e3-8b7b-4f21-a844-c503d36536a8",
        "schoolName": "NIRMALARANI SCHOOL"
    },
    {
        "schoolId": "0fb63234-ac42-45ad-acdd-d7e9195e0528",
        "schoolName": "ST.DOMINC CONVENT SCHOOL"
    },
    {
        "schoolId": "0fb77810-f277-4784-9087-d853eb91da0f",
        "schoolName": "Holy Mother Acadmey"
    },
    {
        "schoolId": "100544fd-ceb1-4240-9c20-e27bfde2cc79",
        "schoolName": "HARVEST HIGH SCHOOL"
    },
    {
        "schoolId": "101fd65e-dbc2-4227-8a50-77f061258cc6",
        "schoolName": "VCV Matric Hr.Sec.School"
    },
    {
        "schoolId": "103e4cd0-baf4-4cd8-9f33-33448deb9b24",
        "schoolName": "Shanthi Nikethan High School-Jeedimetla"
    },
    {
        "schoolId": "106333ab-c2d0-4ad1-a7ab-751a0d4007eb",
        "schoolName": "GOPI KRISHNA SCHOOL"
    },
    {
        "schoolId": "111ecbce-35f5-4f91-86d7-758686b1b54b",
        "schoolName": "NAGARJUNA EM SCHOOL"
    },
    {
        "schoolId": "112b927b-1544-4580-baf1-1deb1b12b2ec",
        "schoolName": "ABYASA SCHOOL"
    },
    {
        "schoolId": "118bebd8-5a67-461a-a84d-6ebcd6b7053a",
        "schoolName": "Dargeeling Public"
    },
    {
        "schoolId": "11ac8724-d1fc-4421-ad29-9a000149a2ec",
        "schoolName": "Modern Srnior School-Nanganallur"
    },
    {
        "schoolId": "11b99365-5ee3-41a5-9b9d-ce19755cfb02",
        "schoolName": "CHANAKYA SCHOOL"
    },
    {
        "schoolId": "11ccf390-cd2a-4ac8-a3ba-2d3a7e42ca67",
        "schoolName": "St. Paul'S Academy"
    },
    {
        "schoolId": "11d386cf-b8f8-4e66-83d4-d368b103b90c",
        "schoolName": "Teens Word School"
    },
    {
        "schoolId": "122257e9-aa5c-4b08-b99b-91e64518b315",
        "schoolName": "ST:JOSPEH PUBLIC SCHOOL"
    },
    {
        "schoolId": "1266df87-9ca4-427d-939c-245e41550555",
        "schoolName": "PARAMA BATTARA KENDRIYA VIDYALAYA"
    },
    {
        "schoolId": "126f6bfa-ea57-4b19-9a67-38b2d639102b",
        "schoolName": "Christ Nagar Hr. Sec. School - Icse"
    },
    {
        "schoolId": "1283b882-3045-4d27-ad3a-2e1ee64144e8",
        "schoolName": "J P Central School"
    },
    {
        "schoolId": "12cdf799-8203-40c7-832f-30bbc780a465",
        "schoolName": "Nirmal Jyothi Public School"
    },
    {
        "schoolId": "13408886-90c0-45b8-ba6a-c8c14a51a5f0",
        "schoolName": "REGIONAL PERFECT ENGLISH SCHOOL"
    },
    {
        "schoolId": "136f8ee1-7097-4198-841b-74b7eb1966e8",
        "schoolName": "Joe Mount Public School - Aluva"
    },
    {
        "schoolId": "1370c37f-faee-4f17-a472-69fbc96b7a4c",
        "schoolName": "Jairani Public School"
    },
    {
        "schoolId": "14112583-3240-48dd-a295-9d9cfbc55b95",
        "schoolName": "Synergy Mission School"
    },
    {
        "schoolId": "14124897-ad2d-41b6-ab23-0dc1a9d6b627",
        "schoolName": "Naval'S National Academy"
    },
    {
        "schoolId": "1469be26-b2af-4f23-beeb-035bfd8c0365",
        "schoolName": "SARADHA MATRIC"
    },
    {
        "schoolId": "148fc82e-2586-47b9-93a4-d56464ff7d2f",
        "schoolName": "Bharatheeya Vidya Vihar - Mazhuvanchery"
    },
    {
        "schoolId": "14af6c9e-1650-4fc7-b222-a274e5ddcef9",
        "schoolName": "Akshara English Medium School-Machayapalem"
    },
    {
        "schoolId": "1545a7a5-a03d-4c43-a78f-4fe90e11d8ec",
        "schoolName": "New Era High school"
    },
    {
        "schoolId": "1584d774-1f74-4c32-b5e4-e95eecbc713f",
        "schoolName": "global indian international school"
    },
    {
        "schoolId": "15af639e-4789-440f-9b1a-7721b46f14ad",
        "schoolName": "Jagran Public School"
    },
    {
        "schoolId": "1612dae2-586c-4139-acb0-9f386c2f2023",
        "schoolName": "Al Aman English Medium School - Pathanamthitta"
    },
    {
        "schoolId": "16352af0-5fa6-4861-842b-b15f8258f22a",
        "schoolName": "Ashwani Public School"
    },
    {
        "schoolId": "16d374b7-7671-4be0-a8d9-08eaabf6a84b",
        "schoolName": "The Abacus Central School"
    },
    {
        "schoolId": "1712b37c-4267-4b5e-805e-f881a51a678c",
        "schoolName": "KRISHNANAGAR ACADEMY"
    },
    {
        "schoolId": "175ecf12-6c45-4f96-8954-fcbf7c9f4e41",
        "schoolName": "MADVOOR CENTRAL SCHOOL - MADVOOR"
    },
    {
        "schoolId": "1763e26e-574d-45fe-8cf0-df8b3cc45742",
        "schoolName": "Velammal Mat.Hr.Sec.School-Paruthipattu"
    },
    {
        "schoolId": "178e91ff-089a-417e-8f18-64dc0992d184",
        "schoolName": "Shree Bharath Vidyaashram"
    },
    {
        "schoolId": "17a8ae4e-c13e-4a43-a2e9-edad5ad9f766",
        "schoolName": "shyen INTERNATION sc"
    },
    {
        "schoolId": "17c7f6c6-06e4-425c-b766-d1d25e78191b",
        "schoolName": "ST MARIA SADHANA SCHOOL"
    },
    {
        "schoolId": "17d5b3ab-f449-461d-8358-3bd9bad9abde",
        "schoolName": "Schram Anna Nagar"
    },
    {
        "schoolId": "17f95863-9127-436d-b4f2-e1df1e7b1b35",
        "schoolName": "AL AZHAR ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "180bbf90-5861-4462-9933-10a09291b0a4",
        "schoolName": "GLOBAL E.M SCHOOL"
    },
    {
        "schoolId": "1830ef10-d080-4f2a-ba1b-bae9aa99424a",
        "schoolName": "SRK INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "187a29a4-94be-4eae-8d17-e71dea308a8a",
        "schoolName": "MOTHER INDIA SCHOOL - ATTINGAL"
    },
    {
        "schoolId": "18b3e24c-069e-4141-a3f2-5a66d10cb20e",
        "schoolName": "Krist Raja High School"
    },
    {
        "schoolId": "18ca8480-649d-43d5-89c5-0641e80e8906",
        "schoolName": "Kidz Don Bosco School"
    },
    {
        "schoolId": "18f6d922-7a26-4155-b454-167821bc05fe",
        "schoolName": "Sabarigiri Senior Secondary School - Punalur"
    },
    {
        "schoolId": "1916d6fa-88bc-4dc9-8311-1034fb088c7e",
        "schoolName": "Maruthi Hr.Sec.School"
    },
    {
        "schoolId": "1959c39f-3232-448a-9caf-8b4c03210e4b",
        "schoolName": "Sreeman Narayanaa School"
    },
    {
        "schoolId": "1968d535-6320-4313-81fb-8c510a4c7373",
        "schoolName": "KAIRALEE NILAYAM SCHOOL"
    },
    {
        "schoolId": "19922d4e-0c64-4621-985a-4d9b78a62613",
        "schoolName": "PRESTIGE INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "1a2b209c-cc35-4a3d-90ae-9233f0558a71",
        "schoolName": "GEM SCHOOL"
    },
    {
        "schoolId": "1a469544-c746-4f96-a422-2aa006278652",
        "schoolName": "OXFORD SCHOOL"
    },
    {
        "schoolId": "1a823dc2-8f6f-4dcb-8c27-8e86defb4ab2",
        "schoolName": "Green Valley School"
    },
    {
        "schoolId": "1a950ef1-2fb6-414e-8686-a5f09360618b",
        "schoolName": "SREE VENKTESWARA HSS"
    },
    {
        "schoolId": "1aadec9e-c1b3-43d4-880e-8851191ae8f0",
        "schoolName": "Meadows English School"
    },
    {
        "schoolId": "1ac9816e-2a1d-4728-adca-8f8e52b72302",
        "schoolName": "Collambus Public School"
    },
    {
        "schoolId": "1b530f5c-5b40-4116-bb1b-d778152c74e0",
        "schoolName": "R.S.R E.M SCHOOL"
    },
    {
        "schoolId": "1b59f797-1dab-4549-8dae-2c430bcd6d3d",
        "schoolName": "Iqura Inter School- Madurai"
    },
    {
        "schoolId": "1bb6c8e1-fa3d-43b3-bf3b-922d9a7ff1e9",
        "schoolName": "STELLA MARIS PUBLIC SCHOOL"
    },
    {
        "schoolId": "1bc43508-e0cd-46db-af26-4a3eaaba1664",
        "schoolName": "I.N.S Public School"
    },
    {
        "schoolId": "1bcff670-5d83-426c-8dcf-9faede574c6a",
        "schoolName": "PHONIX ENGLISH MEDUIUM SCHOOL"
    },
    {
        "schoolId": "1c60df4d-65d1-4d00-8888-8d02d7a0cece",
        "schoolName": "SHANTI DHAMA SCHOOL"
    },
    {
        "schoolId": "1c8ff223-ab14-4043-869d-b13850ffa830",
        "schoolName": "vijay mary hg school"
    },
    {
        "schoolId": "1caa7628-1b49-46a4-8988-b5ff2c853729",
        "schoolName": "Coastal Guard Kindergarten-Meemnambakkam"
    },
    {
        "schoolId": "1cc8ef33-07fe-4e1b-9570-975d78fdb933",
        "schoolName": "GREEN PARK SCHOOL"
    },
    {
        "schoolId": "1cfbd239-9bd9-4681-b9e6-3cd70cc96b8c",
        "schoolName": "Holy Cross Higer Secondary School-Thellakom"
    },
    {
        "schoolId": "1db802a2-1be4-4348-8558-46c2ab6bd809",
        "schoolName": "Santhome Central School (ICSE)"
    },
    {
        "schoolId": "1de7faaf-4d83-4efa-a7a4-515c5965759f",
        "schoolName": "BALA SARASWATHI MAT.SCHOOL"
    },
    {
        "schoolId": "1dfbefe6-3d8d-469c-bb47-4c2a65e86af1",
        "schoolName": "SRVS"
    },
    {
        "schoolId": "1e7ca1f4-2db9-4ae9-851e-79bb68485f8e",
        "schoolName": "AL QUMAR ENGLISH SCHOOL"
    },
    {
        "schoolId": "1ece5fad-14f1-4b23-8787-7cb494fef99a",
        "schoolName": "SENAITALAIVAR N&P SCHOOL"
    },
    {
        "schoolId": "1edb5fc4-a504-47cd-9521-7e4c20ca7f8d",
        "schoolName": "BETHAL MHS SCHOOL"
    },
    {
        "schoolId": "1efadbff-f585-480b-a11f-97d718bc1644",
        "schoolName": "H. S. Memorial School"
    },
    {
        "schoolId": "1fd3d89d-027d-4840-8121-9c01739d7e4a",
        "schoolName": "MATHRU SREE SCHOOL"
    },
    {
        "schoolId": "1fddd399-0dd8-4d0c-9282-1fc066b6d469",
        "schoolName": "SUDHARSANAM VIDYASHARAM CBSE SCHOOL"
    },
    {
        "schoolId": "20432cb5-62c1-4bec-9703-b034cb68a7e7",
        "schoolName": "SAV CBSE SCHOOL"
    },
    {
        "schoolId": "205c157b-5d05-4611-9057-ac221361c57b",
        "schoolName": "SREE VENU CENTRAL SCHOOL"
    },
    {
        "schoolId": "206b3b2e-fd22-4557-a8ac-705d0529daf7",
        "schoolName": "Cms Group School"
    },
    {
        "schoolId": "20bd4404-8d27-4097-9928-80dcceae330d",
        "schoolName": "Pioneer School"
    },
    {
        "schoolId": "20c345ff-9c6b-471a-ab75-868a714afc03",
        "schoolName": "Adarsh Vidya Niketan"
    },
    {
        "schoolId": "2138847b-0578-4f01-878c-590b68b20470",
        "schoolName": "Nirmalamatha Central School"
    },
    {
        "schoolId": "213abbcd-e137-49ce-8b40-74acc3f9cea8",
        "schoolName": "NOBLE SAINT SCHOOL"
    },
    {
        "schoolId": "2181e614-f562-46f6-aceb-14fffdada249",
        "schoolName": "ARRS ACADEMY SCHOOL"
    },
    {
        "schoolId": "21d6e22e-5b31-484e-95c3-2436f2474774",
        "schoolName": "Nav Jeevan Mission School"
    },
    {
        "schoolId": "2240fb69-2417-4aeb-b8ec-ac92008b3c90",
        "schoolName": "Carmel School"
    },
    {
        "schoolId": "22966bcf-bd3c-4d5a-8eb5-66e8be8d63f8",
        "schoolName": "Sundram School"
    },
    {
        "schoolId": "2358ec10-8a35-4157-9d4d-7c75066d52ed",
        "schoolName": "MPP School"
    },
    {
        "schoolId": "2383e1a8-a258-4148-a73e-ec44e199c765",
        "schoolName": "Tender Heart School"
    },
    {
        "schoolId": "23ba2abf-af85-4595-b828-3120371717b6",
        "schoolName": "PLASENT ENGLISH SCHOOL"
    },
    {
        "schoolId": "23ec344f-c2b6-474a-8f90-bd5023dcc9b2",
        "schoolName": "SARWESHWARA SCHOOL"
    },
    {
        "schoolId": "24b41a8d-0534-4713-b705-d2a450b79780",
        "schoolName": "SAV BALAKRISHNA CBSE"
    },
    {
        "schoolId": "24b60219-996e-48de-8145-2e8cd177bf40",
        "schoolName": "Bhavans Rajaji Vidhyashram - Kilpauk"
    },
    {
        "schoolId": "24c4757e-22e7-4ede-b2ab-4f3f12ed78ed",
        "schoolName": "St Joseph School"
    },
    {
        "schoolId": "24c70fe3-67c4-4499-be7a-510d04963fff",
        "schoolName": "Jacob Calling"
    },
    {
        "schoolId": "24ee55f0-ee05-4169-a4c3-d27af9177a22",
        "schoolName": "BAITHUL IZZA PUBLIC SCHOOL"
    },
    {
        "schoolId": "25a537ad-7b5e-4621-ab72-06bf8f63d3fb",
        "schoolName": "NVKS CBSE SCHOOL"
    },
    {
        "schoolId": "25babbf8-92cf-408e-a099-f85e8ca91190",
        "schoolName": "Matrix Modern"
    },
    {
        "schoolId": "25c4bc1f-2270-4b0d-913d-1252e4566a38",
        "schoolName": "Vidyasadan Central School - Trivandrum"
    },
    {
        "schoolId": "2617c7e5-c3c9-4771-92d4-9ab97a57846f",
        "schoolName": "Nukrul Huda"
    },
    {
        "schoolId": "264131e9-a177-426c-bf95-7db7bfca61ab",
        "schoolName": "SRI RAMJI SCHOOL"
    },
    {
        "schoolId": "267e44b4-c7a2-4194-a296-a4a03409e892",
        "schoolName": "Rising Sun"
    },
    {
        "schoolId": "268735c1-6811-46aa-be34-56c8d25bd8c1",
        "schoolName": "Bhuhari Matric School"
    },
    {
        "schoolId": "27024e52-f4f6-48df-9648-ea040d88d0a1",
        "schoolName": "VIVEKANANDA MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "276c2bf7-ea69-41a8-b732-87191d45f0a9",
        "schoolName": "Pon Vidyashram Group of CBSE Schools"
    },
    {
        "schoolId": "2793bc70-f839-47b6-b61f-7653aee2f955",
        "schoolName": "GITHANJALI DIJI HIGH SCHOOL"
    },
    {
        "schoolId": "27a5f5db-4176-43f7-9ac3-1e2d7f7713ff",
        "schoolName": "Rose Petals School"
    },
    {
        "schoolId": "27d90dfb-ac5b-4bfd-9118-7adf186dc21c",
        "schoolName": "EXCELL CENTRAL SCHOOL"
    },
    {
        "schoolId": "27ffdb47-388a-4137-a73d-5c7156d3e749",
        "schoolName": "Fern Hill School"
    },
    {
        "schoolId": "282f1f8d-a138-4772-ad2f-57fc88cdf8f0",
        "schoolName": "SIDDARTHA SCHOOL"
    },
    {
        "schoolId": "286b6bea-45a0-49f2-9575-7e1a75cbb6e2",
        "schoolName": "RAVINDRA BHARATHI E.M SCHOOL"
    },
    {
        "schoolId": "286fe012-1556-4357-aaa5-9f711a97545c",
        "schoolName": "Gurukul Vidya School"
    },
    {
        "schoolId": "287157c3-077f-4588-96b4-64d94e9abd68",
        "schoolName": "SAI VIDYA MANDIR"
    },
    {
        "schoolId": "28a3f248-857a-4426-943a-317ae8089252",
        "schoolName": "Keshav Vidya Mandir"
    },
    {
        "schoolId": "28af77cb-17c3-405d-8fd9-d1c5730b2a9a",
        "schoolName": "ARR SL VIDYALAYA CBSE"
    },
    {
        "schoolId": "290ec887-a125-4c6e-9198-c3bb1832f360",
        "schoolName": "Om Sai Public School"
    },
    {
        "schoolId": "2917f9ed-bd42-4a43-9f4d-10497adaf9af",
        "schoolName": "Thalapathy K.Vinayakam Mat. Hr.Sec.Sch"
    },
    {
        "schoolId": "2a272ca2-bf27-4dcd-86e3-ff1bfe34cc35",
        "schoolName": "Auxilium High School"
    },
    {
        "schoolId": "2ab27cc7-0741-4c5f-9450-d09a958400ca",
        "schoolName": "Doon Public School"
    },
    {
        "schoolId": "2b2e24cd-9c09-464f-9bdc-e3f6b8ca527d",
        "schoolName": "ROYAL INTERNATIONAL SR. SEC SCHOOL"
    },
    {
        "schoolId": "2b3c07c9-391c-434e-a8b5-df1a5739917e",
        "schoolName": "MOUNT ZION MATRIC SCHOOL"
    },
    {
        "schoolId": "2b9c7ddd-ecf4-4170-b15f-74326b22a2c6",
        "schoolName": "Lotus Academy"
    },
    {
        "schoolId": "2c0513fd-520d-417c-9422-ed08daf35d11",
        "schoolName": "Lawrence Homen School"
    },
    {
        "schoolId": "2c2ae582-c943-4131-905b-208da7f7c33d",
        "schoolName": "Delhi Public School"
    },
    {
        "schoolId": "2c6563c3-2d1b-4366-8126-9044ba28282c",
        "schoolName": "ST MARYS SCHOOL"
    },
    {
        "schoolId": "2c7ba193-140e-4226-b4e6-e6b2faeb9cdc",
        "schoolName": "Mahabodhi Mission"
    },
    {
        "schoolId": "2d370b03-4af4-4c02-8f91-35863e5f45e1",
        "schoolName": "National IT Play School- Kumananchavadi"
    },
    {
        "schoolId": "2d4b45b4-c23f-448e-bf0e-5ba8b4819b4f",
        "schoolName": "SAIZENIOUS SCHOOL"
    },
    {
        "schoolId": "2d6fdec1-15f5-4da6-a399-5faf21acc2cd",
        "schoolName": "Royal Grammer"
    },
    {
        "schoolId": "2dc50eca-0c48-4254-b814-c06ee4c44620",
        "schoolName": "St. Paul Institution"
    },
    {
        "schoolId": "2dde983c-2dcb-4c95-8b52-1d8940b95229",
        "schoolName": "SSKV Boys High School"
    },
    {
        "schoolId": "2e166a60-2b33-4287-ad5f-bcf5a8d6b436",
        "schoolName": "Suguna central school"
    },
    {
        "schoolId": "2e733f37-887e-4aba-a0f9-dadc977df486",
        "schoolName": "Idayam Rajandran School- Madurai"
    },
    {
        "schoolId": "2e8d61eb-d3b8-455b-88cd-29be1fa2c447",
        "schoolName": "TRINITY SCHOOL"
    },
    {
        "schoolId": "2ea9fee0-fcf9-49f5-86c3-92f917ee5479",
        "schoolName": "Crescent Public School-Aluva"
    },
    {
        "schoolId": "2f2293bc-67fd-49dc-9e00-0e4801fb1f08",
        "schoolName": "Evershine School- Pathanamthitta"
    },
    {
        "schoolId": "2f404213-52a3-4b64-958d-b8e6ca7f6ca1",
        "schoolName": "FUTURE KIDS"
    },
    {
        "schoolId": "2f67cce3-50f9-40b9-95b6-0a7ba21472c6",
        "schoolName": "SPK MHS SCHOOL"
    },
    {
        "schoolId": "301a2ad2-9c23-4791-85df-2d173e0f23bd",
        "schoolName": "Vidhyanjali School -Kukatpally"
    },
    {
        "schoolId": "301bd064-c8ec-4fe3-861b-a9eaee13c462",
        "schoolName": "Hilton Matriculation School"
    },
    {
        "schoolId": "302607ba-3f56-428d-97ec-2a3e19710651",
        "schoolName": "GAIDAENS ENGLISH SCHOOL"
    },
    {
        "schoolId": "3032bf72-8fed-4ded-b2c7-036e215070ab",
        "schoolName": "Velammal Mat.Hr.Sec.School-Panchetti"
    },
    {
        "schoolId": "3075c160-ba59-4904-ba31-7d545b4875c2",
        "schoolName": "GNANADEEP SCHOOL"
    },
    {
        "schoolId": "30ec8e6e-d6ea-49ef-a322-98e86c707141",
        "schoolName": "Shradhanand Primary School"
    },
    {
        "schoolId": "31302270-5376-4a3c-9e72-d3eaeec6b197",
        "schoolName": "SISHYA MHS SCHOOL"
    },
    {
        "schoolId": "314ff260-edf7-4fee-af25-881171d094f2",
        "schoolName": "Kalki Ranganathan School"
    },
    {
        "schoolId": "318944b6-ed40-432d-aa94-b98d0078e595",
        "schoolName": "GREEN PARK INTERNATIONAL CBSE SCHOOL"
    },
    {
        "schoolId": "31a46e78-bf88-4acc-a602-8215c129c777",
        "schoolName": "VENKATESWARA MATRIC SCHOOL"
    },
    {
        "schoolId": "31afa02c-6331-4d0c-b868-b94249a142f6",
        "schoolName": "KALAM PRE SCHOOL"
    },
    {
        "schoolId": "31dcfaee-72bc-4858-bda1-b2e03f57673e",
        "schoolName": "Divine Sainik School"
    },
    {
        "schoolId": "31f40b35-968d-45cb-b7d7-529e13c92483",
        "schoolName": "WISDOM PUBLIC SCHOOL"
    },
    {
        "schoolId": "326b4968-b4a3-4f77-aa6e-89311fe9b964",
        "schoolName": "VAMSI E.M SCHOOL"
    },
    {
        "schoolId": "32c19691-29c6-45aa-b73d-537b9dd249d3",
        "schoolName": "Imperial International School"
    },
    {
        "schoolId": "331cdc8c-8f22-4ac9-ada2-7a9249e99e38",
        "schoolName": "St. Xavier'S Schools And Research Center"
    },
    {
        "schoolId": "3359b3f6-4561-4303-81ba-c91f1db25419",
        "schoolName": "Bharitayarvidhya Bhavan"
    },
    {
        "schoolId": "33b730d2-1b98-4ce8-ab47-060c89df38c1",
        "schoolName": "MATHA SCHOOL"
    },
    {
        "schoolId": "343949c1-61d7-4444-8cea-d771b8272992",
        "schoolName": "Nagarathinam International School of Excellence-Cbe"
    },
    {
        "schoolId": "34d551d0-16ca-40a4-9d1b-d7e7b32631ff",
        "schoolName": "Adiyappana School - Madurai"
    },
    {
        "schoolId": "3604f947-c98d-4653-b4fa-cc38854343df",
        "schoolName": "Endevour's International High School"
    },
    {
        "schoolId": "36081ffb-51ed-4593-8a1e-8f0834e4043b",
        "schoolName": "S.R.G.D.S MHS SCHOOL"
    },
    {
        "schoolId": "3646703f-97a9-4434-980d-1c0119c2951c",
        "schoolName": "St. Dennis School"
    },
    {
        "schoolId": "3685a2dd-f824-4f06-8bdb-c08510e0c096",
        "schoolName": "MARTIN GRAMAR SCHOOL"
    },
    {
        "schoolId": "36a502c0-ca68-443e-bc76-9a756e982d93",
        "schoolName": "CRESENT PUBLIC SCHOOL"
    },
    {
        "schoolId": "36a8043f-5f1a-47b6-beaa-a3f96ad21817",
        "schoolName": "STELLA MARYS SCHOOL"
    },
    {
        "schoolId": "36e30e26-0c8c-43ac-9388-4203a8529037",
        "schoolName": "Al Azhar English Medium School - Manakkodi"
    },
    {
        "schoolId": "36ef1d3e-754b-4952-9af6-fd94510c4131",
        "schoolName": "VANI VIKAS MHSS-ATTUR"
    },
    {
        "schoolId": "36fbf7e0-9dcd-48eb-85e8-27934c9632ce",
        "schoolName": "KRISHNANAGAR PUBLIC SCHOOL"
    },
    {
        "schoolId": "37192f23-284c-4b36-b5a7-d02da672347c",
        "schoolName": "SREE NARAYANA CENTRAL SCHOOL"
    },
    {
        "schoolId": "372507bc-435d-44f5-8c5c-2a533a0949c0",
        "schoolName": "MAHATMA GANDHI CBSE SCHOOL"
    },
    {
        "schoolId": "3739e0cf-096d-4c6c-a943-e1999ecb3bfc",
        "schoolName": "Markaz public school"
    },
    {
        "schoolId": "3758ad08-505c-4f2b-9927-3cf73e576d2c",
        "schoolName": "BHARATEEYA VIDYAPEEDOM"
    },
    {
        "schoolId": "378a9c5b-6134-44d3-8dc3-fdb8e2a4e24a",
        "schoolName": "PES Vidyalaya"
    },
    {
        "schoolId": "37da4722-cc2d-4fd2-bf03-3f1b5418d9a2",
        "schoolName": "Velumanickam Natric. Hr. Sec. School"
    },
    {
        "schoolId": "37f9e625-b3a9-4691-966d-03dac8a3730e",
        "schoolName": "Lko Modern Inter College"
    },
    {
        "schoolId": "3900abff-69cd-4cb8-91a6-caeb2611920e",
        "schoolName": "MARY MATHA CMI MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "3917165b-9116-402b-b913-79bdb6eb91cd",
        "schoolName": "ARIVALAYAM MAT.SCHOOL"
    },
    {
        "schoolId": "39348e7c-9ab8-4512-b1b9-dba195f6eb6b",
        "schoolName": "Kalaimagal Hr Sec School"
    },
    {
        "schoolId": "397d4c66-ec90-4a1c-af4c-e44f46a7fbef",
        "schoolName": "MAI SCHOOL"
    },
    {
        "schoolId": "39f2ee01-af8c-471e-85cb-3e124db8545c",
        "schoolName": "Sabarigiri New Generation School - Nilamel"
    },
    {
        "schoolId": "3a00b1b2-9433-4b3b-8a84-14a4a13bb80b",
        "schoolName": "S U PUBLIC SCHOOL"
    },
    {
        "schoolId": "3a0b15ea-38cd-4e66-ac8a-2d229b3600e0",
        "schoolName": "Kuresia eng school"
    },
    {
        "schoolId": "3a697181-77ac-4c0e-8618-a63ba1077a39",
        "schoolName": "Sri Ambal Public School"
    },
    {
        "schoolId": "3aa6629c-fd22-47b9-9f65-cce016ee456a",
        "schoolName": "Ludhani Vidya Mandir"
    },
    {
        "schoolId": "3af13780-5083-4504-ab63-5999ccfff76b",
        "schoolName": "Carlokavin School"
    },
    {
        "schoolId": "3b18e6b2-f856-4ec1-9a53-a6fcef604031",
        "schoolName": "St. joseph School"
    },
    {
        "schoolId": "3b2f2163-2e39-49f0-8e6a-19cbf184c41b",
        "schoolName": "Shikshaa Matric. Hr. Sec. School"
    },
    {
        "schoolId": "3b85aac2-052f-4f5b-bf74-e530c35edf7d",
        "schoolName": "Colonel S.N.Misra School"
    },
    {
        "schoolId": "3bc22ce2-b847-4951-8578-970d5ea21c35",
        "schoolName": "AL AMEEN PUBLIC SCHOOL"
    },
    {
        "schoolId": "3bc9e181-65a7-4fbe-9598-da690b265951",
        "schoolName": "SARADHA HIGH SCHOOL"
    },
    {
        "schoolId": "3bf3467f-6a99-4cf7-a44b-75093276ff81",
        "schoolName": "RADIYANT INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "3c3bce65-3554-464a-bd30-8202180df381",
        "schoolName": "Rajagiri St. Chavara CMI Public School-Manappuram"
    },
    {
        "schoolId": "3c6875ad-a6b5-45b4-a356-566ccd01cc70",
        "schoolName": "tejaswini vidyaranya"
    },
    {
        "schoolId": "3c775db4-7894-4652-892e-e0b0dd2cff58",
        "schoolName": "Schram Ayanambakkam"
    },
    {
        "schoolId": "3cb1c0af-aaa2-4099-9d12-16da497bde15",
        "schoolName": "R.D. Memorail Public School"
    },
    {
        "schoolId": "3cc54d44-3880-4911-bd3a-2a78a5ec7059",
        "schoolName": "St Pauls School"
    },
    {
        "schoolId": "3ceb6a3c-286a-488d-810a-8c9cd7b57f77",
        "schoolName": "VEDIC VIDYASHRAM CBSE"
    },
    {
        "schoolId": "3d483d33-b549-44a2-9c4c-80cc7101a1f8",
        "schoolName": "SRI KRISHNA MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "3d629972-a370-432a-8a3a-c7f6c23e4cc6",
        "schoolName": "Boon Max School"
    },
    {
        "schoolId": "3da0f052-5f90-4f05-a381-976b870b516a",
        "schoolName": "Sanskriti Public School"
    },
    {
        "schoolId": "3db39e52-95a8-49af-b11e-b55c10638f79",
        "schoolName": "PSY Matric School"
    },
    {
        "schoolId": "3deb2242-2ad1-43bc-b03b-bba1d598f547",
        "schoolName": "Raghavendra Matric School"
    },
    {
        "schoolId": "3df25102-123e-4eb1-8722-135b1c983606",
        "schoolName": "Mother Susan School - Pathanapuram"
    },
    {
        "schoolId": "3e212ef4-06d4-4f01-9257-497fa36e8455",
        "schoolName": "Oxford School Gola"
    },
    {
        "schoolId": "3e2b610d-2801-4a8b-a7be-d728e5677eda",
        "schoolName": "ROYAL PARK SCHOOL"
    },
    {
        "schoolId": "3e2ef281-49b5-4264-ab67-1718f788e6dd",
        "schoolName": "SMILES CBSE SCHOOL"
    },
    {
        "schoolId": "3e3764ac-e0ca-4746-a9f3-489ad2cbf63c",
        "schoolName": "ANNAI ABIRAMI NATIONAL SCHOOL"
    },
    {
        "schoolId": "3e7cd69b-aad3-4e24-9df7-05bc0824ea62",
        "schoolName": "SHAKESPEARE MATRIC SCHOOL"
    },
    {
        "schoolId": "3e85f516-3e40-483f-891d-1f32076ff98b",
        "schoolName": "M.G.M. School"
    },
    {
        "schoolId": "3e8f9085-6e18-4b7a-bf05-9b481eb216e2",
        "schoolName": "SEV School- Madurai"
    },
    {
        "schoolId": "3e972576-8f58-4373-85e4-8abead298e3a",
        "schoolName": "YOUTH WELFARE MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "3e9ffae4-c7a5-4b29-830e-099b93d44728",
        "schoolName": "Little Flower LP School"
    },
    {
        "schoolId": "3f03cd85-c42f-4fbb-918c-6af897e27258",
        "schoolName": "C.E.O.A Matriculation Higher Secondary School-Madurai"
    },
    {
        "schoolId": "3f47361a-aca2-4d50-92a0-25de06d950e8",
        "schoolName": "SPJ Matric School - Madurai"
    },
    {
        "schoolId": "3fb4298d-1231-4734-8e2c-d5eb091dffc1",
        "schoolName": "Prakash vidyalam"
    },
    {
        "schoolId": "3fc60563-028a-435b-8dd1-bc4cb0d88885",
        "schoolName": "K.E. Carmel School - Pulincunnoo"
    },
    {
        "schoolId": "3fdba6ea-6d1b-4a53-8e94-200ccb31a62d",
        "schoolName": "SHRI MAHARISHI VIDYA MANDIR CBSE"
    },
    {
        "schoolId": "3fdf2bf7-f075-4d6f-9723-695758003319",
        "schoolName": "St. Fransis"
    },
    {
        "schoolId": "401846ba-4604-4e1c-b158-c4c92d809313",
        "schoolName": "ST JOSEPH PUBLIC SCHOOL"
    },
    {
        "schoolId": "40190ba8-f359-4687-aa67-7b206a7883cd",
        "schoolName": "NAGARAJUNA CONCEPT SCHOOL 5 SCHOOLS"
    },
    {
        "schoolId": "405b0279-1dd1-4c13-b314-2da357ca2cc8",
        "schoolName": "ST FLOWERS SCHOOL"
    },
    {
        "schoolId": "40dd2a28-0ae1-4532-a0e5-0b2493d527c5",
        "schoolName": "NISHA MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "40ee1a82-780f-46fd-bf80-b11723312d94",
        "schoolName": "VMJ School- Madurai"
    },
    {
        "schoolId": "41211e7a-cef7-4b65-ad5b-490ed5547194",
        "schoolName": "Bharati English medium school"
    },
    {
        "schoolId": "4186b301-c0a1-4fe7-8796-7784443571e2",
        "schoolName": "Mythili English Medium School"
    },
    {
        "schoolId": "41ac9f4a-dd42-43ea-8d7e-30bd3a85bac3",
        "schoolName": "SAS VIDYALAYA"
    },
    {
        "schoolId": "42004e68-b6df-430a-b24e-af3ae02eba3a",
        "schoolName": "BLUE BELLS SCHOOL"
    },
    {
        "schoolId": "420c4860-5f86-4d5e-9ee5-add51f9249ba",
        "schoolName": "MARY VISION MATRIC HR SEC .SCHOOL"
    },
    {
        "schoolId": "426bbcde-8c4d-4527-9749-ed01a5111d2a",
        "schoolName": "Dav School"
    },
    {
        "schoolId": "426ed647-95a3-4e56-acc5-f5c2c4f39cb7",
        "schoolName": "GAYATHIRI GIRLS MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "430a9fdc-9faa-477f-80cf-107fe6812858",
        "schoolName": "Race English Medium School"
    },
    {
        "schoolId": "4347d52b-9ca3-4463-adab-5b7fde68dace",
        "schoolName": "Patla Public School"
    },
    {
        "schoolId": "435178ac-c0c5-4433-896f-9a51a3272c6a",
        "schoolName": "St. Johns Sr. Sec. School"
    },
    {
        "schoolId": "436718b8-f923-4e25-97fc-c912cce572e0",
        "schoolName": "R S Convent Sainik School"
    },
    {
        "schoolId": "4375485b-ab3c-4ec1-9966-07a5f2ea5e92",
        "schoolName": "Chinmaya Anna nagar"
    },
    {
        "schoolId": "4390ee3e-e3ca-4569-b6a6-38d7f6783f9b",
        "schoolName": "ALMADINA SCHOOL"
    },
    {
        "schoolId": "43c872f7-8035-4e8f-9c26-1bfc6345209d",
        "schoolName": "Carmel Convent English Medium School - Thadiyoor"
    },
    {
        "schoolId": "443ee68f-a453-4584-9643-adaecd12147b",
        "schoolName": "Christ Thiruvalla Cultural Trust(CTCT)"
    },
    {
        "schoolId": "44b049e9-0b69-443c-87ec-f2d702f776d2",
        "schoolName": "A.R.R. Public School"
    },
    {
        "schoolId": "4508bbfa-406c-4659-b686-7b1ef9f7ee79",
        "schoolName": "Bhawans Netaji Subhash Chandra Bose Vidyaniketan"
    },
    {
        "schoolId": "4524e96b-dcaf-44f5-8b3c-700e03c104fc",
        "schoolName": "NIVEDHA MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "45589980-a1ac-4877-98a2-19c8c8119da6",
        "schoolName": "St.Ranjeet Singh Public School"
    },
    {
        "schoolId": "459bd2c9-2319-425b-93c8-d6f5aeb852f4",
        "schoolName": "VALLIAMMAL MHS SCHOOL"
    },
    {
        "schoolId": "45b45d12-e64b-42f1-a0e2-493789db2fcc",
        "schoolName": "Carmel English Medium School - Ottappunna"
    },
    {
        "schoolId": "46a26377-41ba-40bf-b64f-d55c6a3120fc",
        "schoolName": "BVR School"
    },
    {
        "schoolId": "46c19c34-a083-4bee-85e4-fe3914bd963b",
        "schoolName": "Lion Public School"
    },
    {
        "schoolId": "46c32a77-8997-4403-9201-7d487715546d",
        "schoolName": "BRIGHT PUBLIC SCHOOL"
    },
    {
        "schoolId": "46d4d0f3-cba4-475d-8ecf-2616835d8016",
        "schoolName": "St Jagat Gyan Public School"
    },
    {
        "schoolId": "47335b2f-e1df-425b-ba9c-e8682a1519a6",
        "schoolName": "GLOBAL INDIA PUBLIC SCHOOL"
    },
    {
        "schoolId": "4736ea6a-ae9e-4fa8-9eae-743e3bb3c47b",
        "schoolName": "ST:JOSPEH CONVENT EMS"
    },
    {
        "schoolId": "475d5a27-2bc9-42a0-8307-8c199e83a664",
        "schoolName": "APPLE CBSE SCHOOL"
    },
    {
        "schoolId": "476beb9e-7212-4ec9-b849-76cb7a27bc10",
        "schoolName": "Simhapuri Day School"
    },
    {
        "schoolId": "483d45a5-4d19-4e7c-a383-2d0aacee1e9e",
        "schoolName": "Gurukul"
    },
    {
        "schoolId": "484bae4e-e676-4a5c-afa0-10955e7b07e3",
        "schoolName": "SARASWATHI VIDHYANIKETAN"
    },
    {
        "schoolId": "484c1d58-6dbb-4186-8ba4-b6dcc0f34023",
        "schoolName": "Model Public School"
    },
    {
        "schoolId": "489e6848-d5ad-48c8-95e5-a26e31405539",
        "schoolName": "MADAVI BOOK CENTER"
    },
    {
        "schoolId": "49a5cc49-d1c6-4fc6-9bca-da218a8f2301",
        "schoolName": "VISWA VIDYALAYA CBSE SCHOOL"
    },
    {
        "schoolId": "49c4931d-1fa2-4f2a-8207-ad3400008e89",
        "schoolName": "MAJLIS ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "49c5bd94-8104-4d5d-a414-94f63229d600",
        "schoolName": "NIRMAL HRIDAI HIGH SCHOOL"
    },
    {
        "schoolId": "49cc0de1-fb51-4f5f-bef9-789c95aebd52",
        "schoolName": "Arundhuti Academy"
    },
    {
        "schoolId": "4a2b90bc-422d-4258-9614-b6dd7b200f99",
        "schoolName": "DE Pal school"
    },
    {
        "schoolId": "4ad9cb6a-b68b-433f-b533-602300c0ad9d",
        "schoolName": "VEDHAM SCHOOL"
    },
    {
        "schoolId": "4aef13cc-615c-4cf9-a9ff-0f11ad9a5b4b",
        "schoolName": "Jaipuriya Public School"
    },
    {
        "schoolId": "4b21415a-0b4c-42af-9e56-f8f7bae01f3c",
        "schoolName": "AVS CENTRAL SCHOOL"
    },
    {
        "schoolId": "4b9d2a31-9373-4465-84dd-710638a6e0d3",
        "schoolName": "Amala Public School - Ottappunna"
    },
    {
        "schoolId": "4bd64ee5-8a9d-47af-b8bd-4ec47c70ebd4",
        "schoolName": "New Ways School"
    },
    {
        "schoolId": "4c01f122-d218-410a-b8a8-45c88a8984b5",
        "schoolName": "Tecno Academy"
    },
    {
        "schoolId": "4cb454aa-a67a-41d5-aef0-9ff1c5d7293d",
        "schoolName": "HOLY CROSS SCHOOL"
    },
    {
        "schoolId": "4d041d88-e0d6-4870-a783-bc1980faa3d9",
        "schoolName": "HIRA PUBLIC SCHOOL"
    },
    {
        "schoolId": "4d0759b6-61b1-4f39-b057-ca20d5f38eee",
        "schoolName": "National Matric School"
    },
    {
        "schoolId": "4d683e33-a0d6-4ab6-96aa-d02ad09af669",
        "schoolName": "Bodhichariya Ser Sec School"
    },
    {
        "schoolId": "4da8c19e-1e36-4612-9753-aded6a6e031e",
        "schoolName": "Little Flower Eng Med Hr Sec School - Edava"
    },
    {
        "schoolId": "4dc81690-8582-4803-bd6f-624af9776706",
        "schoolName": "Loyala (N) School"
    },
    {
        "schoolId": "4dd4bbe6-5650-4e2e-94b1-79e6014df46e",
        "schoolName": "Viswadeepthi Public School"
    },
    {
        "schoolId": "4ddfe4bf-15e2-42d4-9cb9-f8afa5456f8f",
        "schoolName": "Mount Carmel School"
    },
    {
        "schoolId": "4df0e504-6de5-455e-a73d-d40836d93d18",
        "schoolName": "SREE SUVIDHA EM SCHOOL"
    },
    {
        "schoolId": "4df5a17c-c2d9-439d-ae6c-447ac7c710e6",
        "schoolName": "SREENIDHI SCHOOL"
    },
    {
        "schoolId": "4e0c3dd3-5419-4a92-b309-9dfc14429088",
        "schoolName": "ISAAC NEWTON SCHOOL"
    },
    {
        "schoolId": "4e295f16-4fa0-4d20-86cc-e7bb662ecec6",
        "schoolName": "APEX INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "4e558672-7ed4-4163-ac26-b7f6a66f501b",
        "schoolName": "srujana hg school"
    },
    {
        "schoolId": "4f67db73-ddc3-4a4c-9db0-7c14ddf19206",
        "schoolName": "Dav Public School"
    },
    {
        "schoolId": "4fcdeaa0-c744-4d5c-bd4e-440288d54da1",
        "schoolName": "Dr Savitha Memorial"
    },
    {
        "schoolId": "4fd3fa2c-e882-47b6-a439-1c8ac4adaa3f",
        "schoolName": "Mar Makil Public School - Kottayam"
    },
    {
        "schoolId": "50110e1f-bed2-4a1c-b17b-fdb0e1ca6424",
        "schoolName": "BEST School"
    },
    {
        "schoolId": "502c99a1-3ce3-4429-b69d-843ef93978cf",
        "schoolName": "Ravindra bharathi vijayawada"
    },
    {
        "schoolId": "50cd0f45-4ade-436f-a8b6-df6923b5097f",
        "schoolName": "SATHAVAHANA PUBLIC SCHOOL"
    },
    {
        "schoolId": "50e7dbbb-a9ef-48ed-aba1-31c1c4f46619",
        "schoolName": "BHAVANS ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "510e9c45-2bf2-43e4-92de-bd3e9d12d06f",
        "schoolName": "B.J.M. English Medium School - Puthuval"
    },
    {
        "schoolId": "512daf16-9048-4dc3-9ff4-0a74979322b6",
        "schoolName": "Shivam Public School"
    },
    {
        "schoolId": "513faca3-afc2-4926-9143-2ac975a3d61b",
        "schoolName": "VIDYO DHYA E.M SCHOOL"
    },
    {
        "schoolId": "51492e21-eb3c-477d-89b7-bca1bdd1a3d6",
        "schoolName": "Islamic National School"
    },
    {
        "schoolId": "514fead2-c6e2-4b1f-99c1-1c0428553687",
        "schoolName": "AUXILIUM SCHOOL- KOLLAM"
    },
    {
        "schoolId": "5191a966-af50-4bf2-9c81-02bb0b028b0e",
        "schoolName": "Rishs International School"
    },
    {
        "schoolId": "51cb20e7-f319-4fc3-9b1f-73cdd5939225",
        "schoolName": "ICA NELLIKKAD"
    },
    {
        "schoolId": "51d6db35-5691-4639-b2ea-f534073b5896",
        "schoolName": "City Central School"
    },
    {
        "schoolId": "51f5e33d-e3f0-4616-80ce-dcdf7e35eb37",
        "schoolName": "VINITH ENGLISH SCHOOL"
    },
    {
        "schoolId": "5202abf4-d59d-48b9-a433-34dddd3dfb30",
        "schoolName": "St. Thereas Academy - Eravu"
    },
    {
        "schoolId": "52771a41-8a55-4375-880e-7f32a283b786",
        "schoolName": "Basant School"
    },
    {
        "schoolId": "52a99961-05b8-4539-b905-6311d9c2c79f",
        "schoolName": "JAWAHAR SCHOOL"
    },
    {
        "schoolId": "52bccff4-0825-442d-b3c0-1e1f0ae1a947",
        "schoolName": "Maria Matric Hr.Sec.School-Royapuram"
    },
    {
        "schoolId": "53225e26-0738-46fc-8198-58662d2c7c1b",
        "schoolName": "Chinmaya Nagar"
    },
    {
        "schoolId": "5326251d-7e2d-4430-9a24-e7b97e10815f",
        "schoolName": "LEARENRS LAND SCHOOL"
    },
    {
        "schoolId": "53299c75-c60d-448c-8a8e-67d78705d079",
        "schoolName": "Andhara Association School"
    },
    {
        "schoolId": "5336a47b-0c14-457d-82ac-3ba369004fdb",
        "schoolName": "CARMEL SCHOOL"
    },
    {
        "schoolId": "533a2ec9-20bd-4a01-9400-c3af65643a41",
        "schoolName": "Lg Haria School"
    },
    {
        "schoolId": "5369a923-b532-4dd4-9106-875697381a9d",
        "schoolName": "RAJA RAVI VARMA CENTAL SCHOOL"
    },
    {
        "schoolId": "53772b75-8e2f-40ee-97bf-1436ef1cebc7",
        "schoolName": "G B Memorial"
    },
    {
        "schoolId": "5409cbd2-5f10-4355-80bc-63d134fe2073",
        "schoolName": "OLIVE PUBLIC SCHOOL"
    },
    {
        "schoolId": "544fb561-aa13-4594-a579-a9e4c19afae8",
        "schoolName": "HOLYCROSS HIGH SCHOOL"
    },
    {
        "schoolId": "5464c5f4-7a3a-44ba-b7fe-8a2baccc7a8d",
        "schoolName": "Ros Public School"
    },
    {
        "schoolId": "5486f124-f123-455b-a2c9-092e983d3862",
        "schoolName": "Carmel Convent E.M. School - Thadiyoor"
    },
    {
        "schoolId": "54be1103-af73-4d01-9614-9a5c14644fab",
        "schoolName": "SRIJI E.M SCHOOL"
    },
    {
        "schoolId": "54cc1ef7-d4a0-4567-bf48-b696f3bfdd0f",
        "schoolName": "St. Xavier High School"
    },
    {
        "schoolId": "55645339-797f-47aa-939c-b465af4ab46c",
        "schoolName": "Sri Harsha School"
    },
    {
        "schoolId": "55d7d81e-8c71-46a0-a245-bdeee7e2ca3a",
        "schoolName": "YES ENGLISH SCHOOL"
    },
    {
        "schoolId": "562ab4ad-72e7-4481-869e-a870c1815c5c",
        "schoolName": "EXCELLENT E.M SCHOOL"
    },
    {
        "schoolId": "56706724-c20a-45fa-891c-6d57c91c2f14",
        "schoolName": "Holi Angel School"
    },
    {
        "schoolId": "570a2c19-c1f6-4b5c-b9a2-db1509ab3d1e",
        "schoolName": "St John High School"
    },
    {
        "schoolId": "5755be74-e4f6-4021-b42d-f7159d3ac035",
        "schoolName": "Vael's Educational Trust"
    },
    {
        "schoolId": "57cfddbc-53fb-41dc-a953-b5db2ddce805",
        "schoolName": "Mile Stone Kids"
    },
    {
        "schoolId": "580c9a11-897f-4c8e-bee4-fc1d3763b6a0",
        "schoolName": "Dips"
    },
    {
        "schoolId": "58472d33-4e01-4773-aa4e-274a72f2c74f",
        "schoolName": "SN KADAKKAL"
    },
    {
        "schoolId": "587564a4-14c8-4969-85b9-551adb54fa81",
        "schoolName": "KSV CBSE SCHOOL"
    },
    {
        "schoolId": "58bc02d3-9bcf-4881-b173-98c6c1656715",
        "schoolName": "Bright Public School- Bangalore"
    },
    {
        "schoolId": "58e41c36-bb7b-4905-b09f-5980bc53a3d1",
        "schoolName": "st antonys hg school"
    },
    {
        "schoolId": "595c1a93-cee4-4912-bfae-833769475561",
        "schoolName": "Viveka Nursery & Primary School-Sundarapandiam"
    },
    {
        "schoolId": "598388a5-55f6-46db-a1c3-dc2389f6d700",
        "schoolName": "New Katak Public School"
    },
    {
        "schoolId": "598ef11e-705b-47cd-8f60-a7a8b189d907",
        "schoolName": "Andulus Public School-Karunagapally"
    },
    {
        "schoolId": "59bac529-5963-4037-871a-02a057ba4b24",
        "schoolName": "EVANCE SCHOOL"
    },
    {
        "schoolId": "59c58396-237d-4e78-aab3-ea2b19dd17e1",
        "schoolName": "SACRED HEART SCHOOL - KUREEPUZHA"
    },
    {
        "schoolId": "5a34b8d2-1468-4372-b553-7f5791089b4d",
        "schoolName": "KMK KANNIYA PILLAI ENGLISH SCHOOL"
    },
    {
        "schoolId": "5a39e5a4-3e44-4ff4-ae9f-e28f807700ba",
        "schoolName": "ISSATH PUBLIC SCHOOL"
    },
    {
        "schoolId": "5a45fed5-fb17-46f3-b815-a2190a477459",
        "schoolName": "VIKAS EM SCHOOL"
    },
    {
        "schoolId": "5a9badd9-f2b0-48a5-8095-9fb56b1cbeba",
        "schoolName": "DR.VGN MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "5aa31c88-4b42-4234-a18e-cdd289c09dd6",
        "schoolName": "Dolphins delhi public school"
    },
    {
        "schoolId": "5aaf477b-5226-40ae-8035-ab9829fefd9a",
        "schoolName": "Sabarigiri Residential School - Anchal"
    },
    {
        "schoolId": "5abd8bed-86c7-4d7c-b3f5-3e39ebb89489",
        "schoolName": "VENUS SCHOOL"
    },
    {
        "schoolId": "5ae1a8e1-4dac-445b-8093-8a568e8caf95",
        "schoolName": "Vani School- Virugambakkam"
    },
    {
        "schoolId": "5b35e715-a0c4-4f2b-ab33-d418a5425f4a",
        "schoolName": "Bethany English Medium School-Ambalapuzha"
    },
    {
        "schoolId": "5b5909fd-e855-49ce-9088-31dd1d2d2055",
        "schoolName": "Mmk High School"
    },
    {
        "schoolId": "5ba6cc3c-7190-409e-8254-229378262384",
        "schoolName": "S B I O A"
    },
    {
        "schoolId": "5bf53000-b250-4434-862b-663c662a0869",
        "schoolName": "A.L.P.School Perigode Pre-Primary School"
    },
    {
        "schoolId": "5c0e7abe-5c4e-44ec-adaf-f4a53c2328d3",
        "schoolName": "Neelakeshi Vidyalaya School"
    },
    {
        "schoolId": "5c118923-6936-43d6-8519-58deaeebbc64",
        "schoolName": "Sophia Primary And High School"
    },
    {
        "schoolId": "5c437f6d-e976-4150-9c98-9dc95c801619",
        "schoolName": "Nagini Vidhyalaya Nursery & Primary School- Vedapatti"
    },
    {
        "schoolId": "5c842103-6459-48d2-aaee-40e6ed0e8eed",
        "schoolName": "Vimala"
    },
    {
        "schoolId": "5cecde7f-a738-4768-a7f0-8abfe8fd6a9f",
        "schoolName": "AMARA JYOTHI SCHOOL"
    },
    {
        "schoolId": "5cefe33e-ea94-4c53-b60e-92f88b3a71a2",
        "schoolName": "BRIGHT MAIND CBSE SCHOOL"
    },
    {
        "schoolId": "5d0ce762-b933-4531-851b-a859a6311f6f",
        "schoolName": "Velammal Mat.Hr.Sec.School-Viraganoor"
    },
    {
        "schoolId": "5d1915cf-934f-405d-816f-e1d84653ffac",
        "schoolName": "Oxford Matric Hr Sec School"
    },
    {
        "schoolId": "5d60f50f-64b4-4dcb-8b46-898fd2f60102",
        "schoolName": "St Miras School"
    },
    {
        "schoolId": "5d63d3d8-8a69-4dcb-a0ee-4116808b29c6",
        "schoolName": "Sricity Chinmaya Vidyalaya- Tada"
    },
    {
        "schoolId": "5d6eee08-992f-448e-97b0-d127c99cd9d7",
        "schoolName": "GULABI SCHOOL"
    },
    {
        "schoolId": "5dd89464-eeb8-4138-827f-f269726c6968",
        "schoolName": "new takshasila hg school"
    },
    {
        "schoolId": "5e015a98-8a1d-4fc6-99d2-1e242b7b47c6",
        "schoolName": "Bps Public School"
    },
    {
        "schoolId": "5e0d226b-d875-4f29-b172-e38c5d6a8d1e",
        "schoolName": "Vidyaniketan School"
    },
    {
        "schoolId": "5e3c8f7d-cc78-426e-9f33-fdcf3f570f71",
        "schoolName": "ASHRAM SCHOOL"
    },
    {
        "schoolId": "5e93afd1-0169-4d1d-87a6-1ec0ac77c985",
        "schoolName": "JOSALAYAM E M L P SCHOOL"
    },
    {
        "schoolId": "5e989b1e-cda0-4c54-a8b6-93fafd72d118",
        "schoolName": "JAIN GLOBAL SCHOOL"
    },
    {
        "schoolId": "5f051524-f343-4515-9c4c-ad6369842713",
        "schoolName": "Hamilton Public School"
    },
    {
        "schoolId": "5f26ff35-2a27-43b2-848f-a3f1256a1c0b",
        "schoolName": "EBENEZER MARCUS MHS SCHOOL"
    },
    {
        "schoolId": "5f3e12dd-9fb8-4cf4-8c0f-1498a2cd6726",
        "schoolName": "DE PAUL PUBLIC SCHOOL"
    },
    {
        "schoolId": "5f4b2ff9-9e7e-41f9-8dfa-4130a2ef2ef8",
        "schoolName": "Holy Family Public School"
    },
    {
        "schoolId": "5f659296-bea6-4b54-ae35-25b5819e41c5",
        "schoolName": "AAKRIDGE E.MSCHOOL"
    },
    {
        "schoolId": "5f7504bf-0352-4e4a-a391-59d1ff790ff4",
        "schoolName": "TALENT MHS SCHOOL"
    },
    {
        "schoolId": "5fd3066a-a5be-49dd-8800-548574c3bc0f",
        "schoolName": "Seven Stars Academy"
    },
    {
        "schoolId": "6060aabe-d15e-495b-9fec-56501974cc43",
        "schoolName": "Erwine Advantage"
    },
    {
        "schoolId": "609a40db-70d4-4b40-a61a-d4ea6a48c1ee",
        "schoolName": "Kola Saraswathi Sr.Sec.School-Kilpauk"
    },
    {
        "schoolId": "60dc352f-f213-4d5d-91c9-225c5b67a5c6",
        "schoolName": "MISIMI SCHOOL"
    },
    {
        "schoolId": "6143849e-2a0a-4f03-8d90-15ff59171136",
        "schoolName": "NAVAYUGA HIGH SCHOOL"
    },
    {
        "schoolId": "614791ed-f0a5-4603-a5a9-58e3793ecb60",
        "schoolName": "MORNING BELL'S ACADEMY"
    },
    {
        "schoolId": "618cdce3-bfc9-4dea-a096-9e7611eaac4b",
        "schoolName": "VIJAYASAI PRIMARY SCHOOL"
    },
    {
        "schoolId": "61ae165d-2943-41e5-93ad-8b66ccd8b058",
        "schoolName": "Study Well Public School"
    },
    {
        "schoolId": "62282c00-6415-4e8a-90c3-aa534d14009a",
        "schoolName": "MUNISWAMY PUBLIC SCHOOL"
    },
    {
        "schoolId": "62372956-6e0f-469b-a4a4-b8aaf8b148ec",
        "schoolName": "AL IRSHAD PUBLIC SCHOOL"
    },
    {
        "schoolId": "626dfeee-41cd-454b-a89a-0aa7ec61c95c",
        "schoolName": "Infant Jesus Public English School"
    },
    {
        "schoolId": "62dcb7b2-c28d-42ed-9123-a2280c2dd1b5",
        "schoolName": "SAI ZENIOUS SCHOOL"
    },
    {
        "schoolId": "62e932e8-d81f-4885-b273-32d49c669449",
        "schoolName": "VISION NURSERY&primary school"
    },
    {
        "schoolId": "62f84251-af6c-4fec-bc2e-9e3e62fa321b",
        "schoolName": "ANNAI VOILET INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "632afa5b-f4c3-46bb-99d6-9f24c12979f2",
        "schoolName": "FAIRLANDS A FOUNDATIONS"
    },
    {
        "schoolId": "632fb652-ccd0-4911-b573-5b8254dff5f8",
        "schoolName": "ST MARIA GORETTI PUBLIC SCHOOL"
    },
    {
        "schoolId": "6362335d-c9fd-4636-a7d1-7a80674638d7",
        "schoolName": "Vimala matha"
    },
    {
        "schoolId": "63746e30-8458-43a0-889f-3866f67cad02",
        "schoolName": "S.B.O.A. Global School-Annanagar"
    },
    {
        "schoolId": "63b7097f-47ff-4b82-a096-3abb4db552de",
        "schoolName": "SARATHA INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "63f8da0a-5409-414b-b844-a39d40486428",
        "schoolName": "ns grammar hg school"
    },
    {
        "schoolId": "6417a4ef-3014-434b-a721-532c0df4565a",
        "schoolName": "Blooming Bird"
    },
    {
        "schoolId": "641aef4b-4aeb-4953-863e-6848c9c14508",
        "schoolName": "SAKTHI VINAYAGAR HINDU VIDYA"
    },
    {
        "schoolId": "64323b68-1527-4948-a6fe-ce2eb5a77192",
        "schoolName": "Loyola Matriculation Hr. Sec.School"
    },
    {
        "schoolId": "643659f6-73c8-4e86-a868-c4b6b3d4c580",
        "schoolName": "SEVA SADN CENTRAL SCHOOL"
    },
    {
        "schoolId": "656e952e-1336-426f-a7f1-011609f04314",
        "schoolName": "HOLY CROSS PUBLIC SCHOOL"
    },
    {
        "schoolId": "658fdecb-dc34-4638-be62-a88d80eb6ca5",
        "schoolName": "St.Joseph A.l.School- Coonoor"
    },
    {
        "schoolId": "65a0b5a3-fcfd-46b2-a4a1-fb1e4612f490",
        "schoolName": "Rcc Public School"
    },
    {
        "schoolId": "65d1a38c-4add-46d1-b3cc-e6392d652c6c",
        "schoolName": "St Marys And Jesus School"
    },
    {
        "schoolId": "65f629ca-6099-4ba8-a8e7-c751efed7966",
        "schoolName": "PUPIL SOFT SCHOOL"
    },
    {
        "schoolId": "66157010-b8ba-47c4-bbdd-ce2261f2fcde",
        "schoolName": "The Aryan International School"
    },
    {
        "schoolId": "661b1bbe-c7a1-4225-86ae-b5df2b28217d",
        "schoolName": "MM Nursery &UP School"
    },
    {
        "schoolId": "6639d807-5c7b-40c9-9e70-781d31d82c58",
        "schoolName": "Vani Uttaramerur"
    },
    {
        "schoolId": "665d3837-67b4-4a66-9840-cdaa965ad5b6",
        "schoolName": "St Thomas Free School Street"
    },
    {
        "schoolId": "66fddbb1-c16a-4ccd-aac2-b1b783d6ffd7",
        "schoolName": "CHRIST NAGAR PUBLIC SCHOOL - ATTINGAL"
    },
    {
        "schoolId": "67075075-d731-461f-8963-da4f8abf95af",
        "schoolName": "SANTHOSH TOTAL 4 SCHOOLS"
    },
    {
        "schoolId": "672dde6c-52a4-42ea-b7e0-d333d8dfa0bd",
        "schoolName": "Our Lady Maticulation Hr.Sec.School -Ponmeni"
    },
    {
        "schoolId": "674bf06d-2521-4de2-8840-80be566e9beb",
        "schoolName": "St Marry School"
    },
    {
        "schoolId": "677b81ab-949a-45b0-8988-bf2e292e7d6f",
        "schoolName": "SENATE PUBLIC SCHOOL"
    },
    {
        "schoolId": "67aef3ea-d83a-4d7a-9b8e-c621d73d3775",
        "schoolName": "Sagardighi Bright Academy"
    },
    {
        "schoolId": "67be60cc-cabd-4637-9e57-deecc677e767",
        "schoolName": "SREE AYYAPPA SCHOOL"
    },
    {
        "schoolId": "67c2a80c-0e38-4167-9554-deea3bf698b6",
        "schoolName": "Chinmaya Vidyalaya Avadi"
    },
    {
        "schoolId": "67d512e8-39d2-4c88-a044-f4507e716ae3",
        "schoolName": "The Scholars Home"
    },
    {
        "schoolId": "67f75c1b-1f6b-4456-876d-6387ef3bbe08",
        "schoolName": "Ramaniyam Sankara Matric Hr.Sec.School"
    },
    {
        "schoolId": "6806e757-65e5-4feb-9221-7b7165f9f811",
        "schoolName": "Nagarjuna High School 9 Raidurg-Darga)"
    },
    {
        "schoolId": "687cf65f-e5c1-483b-af3a-eddf92bb3fcc",
        "schoolName": "ZILLA PUB. SCHOOL"
    },
    {
        "schoolId": "6884c632-6e87-4188-9690-b2123d8ed833",
        "schoolName": "GEREGORIAN PUBLIC SCHOOL"
    },
    {
        "schoolId": "68d0e4aa-8e5d-4fa1-b1a2-4d9ff640ef6e",
        "schoolName": "Sanjos Public School - Pala"
    },
    {
        "schoolId": "690b30e3-d3e4-4bac-8fd1-5f866f220793",
        "schoolName": "SRI SARASWATHI VIDYALAYA MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "691ee189-9e37-444c-9f88-288c8c04687b",
        "schoolName": "ONGOLE PUBLIC SCHOOL"
    },
    {
        "schoolId": "69299e1f-ace4-4404-8a81-fbfdf57093c9",
        "schoolName": "ST JOSEPH MHS SCHOOL"
    },
    {
        "schoolId": "69479bf6-85cf-4629-980a-32e6ff2b9da3",
        "schoolName": "The North India School",
        "": "cedc64fe-a787-11e8-98d0-529269fb1459"
    },
    {
        "schoolId": "69bcaa6d-982c-44a2-8e92-12798ab37648",
        "schoolName": "carmel Central School - Valappad",
        "": "cedc61a2-a787-11e8-98d0-529269fb1459"
    },
    {
        "schoolId": "69bff11b-002e-46d8-8db7-398ee65eec7f",
        "schoolName": "SASTRA MATRIC SCHOOL",
        "": "f2a6c8fe-a780-11e8-98d0-529269fb1459"
    },
    {
        "schoolId": "69cedf14-4242-4a82-a423-06f6077e8674",
        "schoolName": "BALA VIKAS SCHOOL",
        "": "f2a6c598-a780-11e8-98d0-529269fb1459"
    },
    {
        "schoolId": "6a11a873-7581-4456-afea-85723db8db1d",
        "schoolName": "Sahyadri Central School-Kuruvikkonam"
    },
    {
        "schoolId": "6a1538cc-55f7-41ce-89e2-f05d5ec7f2c7",
        "schoolName": "St. Jhons School"
    },
    {
        "schoolId": "6b5ec221-624b-4cd9-8493-0eace5b8e844",
        "schoolName": "KABD CBSE SCHOOL"
    },
    {
        "schoolId": "6b7f3973-9156-445e-9301-337604fce77a",
        "schoolName": "Heritage International Public School"
    },
    {
        "schoolId": "6c11f5af-5ae2-4293-b06e-8bab50b9d952",
        "schoolName": "LITTLE LAMP UP SCHOOL"
    },
    {
        "schoolId": "6c193a6b-0bbd-40da-9f45-8c2772fa5da0",
        "schoolName": "Zenas Intl. School - Miyapur"
    },
    {
        "schoolId": "6c2bb822-39b2-4792-81fa-54a86b21e219",
        "schoolName": "Venkateswar Eng Med School"
    },
    {
        "schoolId": "6c42177f-7c35-4600-bd57-ec0c00cc6e49",
        "schoolName": "Swami Narayan School"
    },
    {
        "schoolId": "6c6e75ad-6286-46a6-825b-e3dc7f1f2700",
        "schoolName": "INFANT JESUS- KOLLAM"
    },
    {
        "schoolId": "6c824326-8979-408d-b5e4-53c249ffd9c3",
        "schoolName": "Anna Gem Science Park"
    },
    {
        "schoolId": "6cbc66a9-b2e1-46b7-8ff8-a016aeb43d4e",
        "schoolName": "Albab Central School Kattoor"
    },
    {
        "schoolId": "6cf8b272-b98e-4efb-90df-4da1463bd58b",
        "schoolName": "Sri Raghavendra cbse School"
    },
    {
        "schoolId": "6dbb2e6e-12e1-479f-b9b1-9a57946148a8",
        "schoolName": "Aliya Senior Secondary School"
    },
    {
        "schoolId": "6dc797a1-25b8-4e38-9942-687518ed4939",
        "schoolName": "SACRET HERT ENGLISH SCHOOL"
    },
    {
        "schoolId": "6de9b824-5215-49c6-b694-4e202a3916f4",
        "schoolName": "Regional High Chool"
    },
    {
        "schoolId": "6e0cc216-b4da-4925-84d5-eaa52acc04f3",
        "schoolName": "ST.XAVIERS INSTITUTION"
    },
    {
        "schoolId": "6e43bc71-d979-4bb2-8102-901dff6ab81b",
        "schoolName": "LIONS ENGLUSH MEDIUM SCHOOL"
    },
    {
        "schoolId": "6e598a0f-e517-4479-9419-369635877ea3",
        "schoolName": "TISK English Medium School"
    },
    {
        "schoolId": "6e813928-7ad6-42ab-9940-17487ed9276f",
        "schoolName": "Smart Vision School"
    },
    {
        "schoolId": "6f3db24d-1511-464f-91f5-e53107ff0aac",
        "schoolName": "ST:CLARET PUBLIC SCHOOL"
    },
    {
        "schoolId": "6f4712cc-aba2-459a-9013-3455e219d1b2",
        "schoolName": "Prabharani Public School"
    },
    {
        "schoolId": "6f66db59-abd6-4729-ace2-88b3b983fbb2",
        "schoolName": "Dharmomveedu M.Narayanan Nair Memorial Hr.Sec.School-Maranalloor"
    },
    {
        "schoolId": "6f87ac77-0957-4559-a424-1779033677f6",
        "schoolName": "Vethathiri Maharishi Hr.Sec.School"
    },
    {
        "schoolId": "6f889d9b-eb02-4b7c-835c-a799f36bb60f",
        "schoolName": "Hindmotor Education Center"
    },
    {
        "schoolId": "6f894ea3-68c8-4868-9545-4f32cc8356bb",
        "schoolName": "Sunflower Academy"
    },
    {
        "schoolId": "6ff42c79-8f7e-4c12-8836-139b56126efe",
        "schoolName": "MILLINIUM MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "7043ec0c-9ff4-43d9-87d8-8e261a544064",
        "schoolName": "Udaiyar Matric School"
    },
    {
        "schoolId": "70fbe1a9-c9f6-4e81-a1ea-e784534ecbc4",
        "schoolName": "GREEN WOODS PUBLIC SCHOOL"
    },
    {
        "schoolId": "713b5158-6fdb-4083-b02b-741e8c6ae4dd",
        "schoolName": "Sundaram School - Aviyur"
    },
    {
        "schoolId": "715684d6-7e23-40b9-ba17-9e33ca93b0ca",
        "schoolName": "M.S. Memorial School"
    },
    {
        "schoolId": "71a0b75f-81c4-4de2-bd39-aaf1dbd7be1f",
        "schoolName": "Cmj Hampton Court School"
    },
    {
        "schoolId": "71b41cef-671f-4733-aa31-bb01d1330fc3",
        "schoolName": "Sofia Memorial"
    },
    {
        "schoolId": "71d7104b-a0e0-4a3c-9186-1ce2b6a82679",
        "schoolName": "Chaitainya Vidyanikethan High School-Qutbullapur"
    },
    {
        "schoolId": "71e362dd-a5d6-46c3-984a-999766d1251f",
        "schoolName": "Vidya Vikasani School"
    },
    {
        "schoolId": "72099930-c76b-4f37-83c3-df5e8b91c90f",
        "schoolName": "GLOBAL MHS SCHOOL"
    },
    {
        "schoolId": "724e6d3f-75bd-489a-b837-4f0bfb57dbb9",
        "schoolName": "ST JOHNS CBSE SCHOOL"
    },
    {
        "schoolId": "728b72a7-3df4-48d6-bf39-39f98f64d242",
        "schoolName": "Vasundra School"
    },
    {
        "schoolId": "72e373bf-7a67-467e-9de5-29887eaeca19",
        "schoolName": "Brindavan Public Schools"
    },
    {
        "schoolId": "734198b9-078f-4d9c-b99b-f814b5821324",
        "schoolName": "Abc Public School"
    },
    {
        "schoolId": "73571615-fa1f-4e36-b8aa-e2bff26673cf",
        "schoolName": "MARIYAM THERISSYA"
    },
    {
        "schoolId": "73b117ef-6252-405e-b986-4090ad89ab55",
        "schoolName": "Bharti Vidya Peeth"
    },
    {
        "schoolId": "73e9ac57-9342-4a45-a8c7-8e6da827be53",
        "schoolName": "SRI BHASHYAM PUBLIC SCHOOL"
    },
    {
        "schoolId": "73ed6ff4-ebe0-4710-bfc8-88391c0d749b",
        "schoolName": "DREAMS E.M SCHOOL"
    },
    {
        "schoolId": "73ff92a8-cf62-4e7e-b67a-5639450d1a7a",
        "schoolName": "Velammal Mat.Hr.Sec.School-Karur"
    },
    {
        "schoolId": "740dc884-3e7f-43a4-8926-7537bfd925b7",
        "schoolName": "NVR Educational Institution"
    },
    {
        "schoolId": "741796d1-f76f-4ea9-8b9f-73ada0c80f62",
        "schoolName": "KRISHNASWAMY NIKETHAN"
    },
    {
        "schoolId": "7511b67b-43ea-4a92-8537-bfc4a7074ab2",
        "schoolName": "P. P. MEMORIAL ACADEMY"
    },
    {
        "schoolId": "7578daa8-d481-45d1-bf2c-d82ce7af5dff",
        "schoolName": "M.E.A. ENG. MED. HR. SEC. SCHOOL - KARICODE"
    },
    {
        "schoolId": "75aaf7cf-69b5-4afc-897e-b659a6bf7e7b",
        "schoolName": "TMHNU VIDYALAYA MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "75bd95b2-fca2-4513-998e-ff8f4d1ce596",
        "schoolName": "Sabarigiri New Generation School - Kowdiar"
    },
    {
        "schoolId": "75c89423-1318-45b6-ab00-198775c18696",
        "schoolName": "Success Mission School"
    },
    {
        "schoolId": "7605fddb-10a5-43bb-b65a-0b8e40ba3941",
        "schoolName": "VIRUTHAI VIKAS"
    },
    {
        "schoolId": "765c16ae-f180-419e-8bb3-821d33316c5e",
        "schoolName": "Dawn Matric School- Mangadu"
    },
    {
        "schoolId": "765fe99e-5a48-4bba-9ad3-1263f015587e",
        "schoolName": "St Solder School"
    },
    {
        "schoolId": "77440a2b-092e-46cb-bee3-4fbb7dce503c",
        "schoolName": "JOHN DEWEY NUR & PRI SCHOOL"
    },
    {
        "schoolId": "775731c6-0c82-4966-ab6e-031b7ea0d868",
        "schoolName": "Buds and Flowers High School-Hyd"
    },
    {
        "schoolId": "77bf2805-1b0b-4f11-ad05-5422919eabd8",
        "schoolName": "Morden School Karkend"
    },
    {
        "schoolId": "77fcd2ab-0756-4d61-95f1-723b117e7e1e",
        "schoolName": "S.B.O.A. Public School (C.B.S.E)- Coimbatore"
    },
    {
        "schoolId": "7841ece3-0857-4a42-927b-4083069d079b",
        "schoolName": "Vikas sc"
    },
    {
        "schoolId": "7892920d-fdbe-4104-b2c1-2b39d2d457c1",
        "schoolName": "MAPS ENGLISH MEIUMSCHOOL"
    },
    {
        "schoolId": "78f3ef52-0479-42bd-872d-be0e72a80ec4",
        "schoolName": "Compeatation Public School"
    },
    {
        "schoolId": "7917377c-18f5-4800-a821-0722dbe9c09e",
        "schoolName": "Brindvan Public School"
    },
    {
        "schoolId": "79580b47-b9ca-4e75-9399-e64dd4e7b9a4",
        "schoolName": "ST. ELIZABETH PUBLIC SCHOOL"
    },
    {
        "schoolId": "79a6c1da-d52d-40fc-bc8c-f79ae745ac29",
        "schoolName": "VIDYA JYOTHI SCHOOL"
    },
    {
        "schoolId": "79acdbad-0c59-4543-b583-e6567053a3b9",
        "schoolName": "Bishop Kurialacherry Public School-Champakulam"
    },
    {
        "schoolId": "79c06d85-df8f-47af-9c4b-aa2e56304a46",
        "schoolName": "Asia Public School"
    },
    {
        "schoolId": "7a12224b-a027-42cd-9c73-31422e188ec1",
        "schoolName": "PRARTHANA SCHOOL"
    },
    {
        "schoolId": "7a2dfd72-912d-4020-9981-d24cbd3f9d11",
        "schoolName": "Infant Jesus - Murukumpuzha"
    },
    {
        "schoolId": "7a44d6c9-4cf5-4c8f-b28f-6737c3d1baf4",
        "schoolName": "MAYFLOWER SCHOOL"
    },
    {
        "schoolId": "7a78abef-e0e6-4731-84c4-21c3cc84f8ec",
        "schoolName": "Jayam Matric Hr. Sec. School - Attur"
    },
    {
        "schoolId": "7a915faf-eb1a-4f90-b6ab-2a7e036189e0",
        "schoolName": "NAG CBSE SCHOOL"
    },
    {
        "schoolId": "7ad7e5cf-aa34-4247-9668-70604b89eb71",
        "schoolName": "SHANTHINIEKATHAN MATRIC SCHOOL"
    },
    {
        "schoolId": "7ae83cb8-47ad-4c77-b0b8-467fe28b4566",
        "schoolName": "Rosemead International School"
    },
    {
        "schoolId": "7b31a94a-a9aa-4a7e-ab09-f7b4c3da5395",
        "schoolName": "Schram Nolambur"
    },
    {
        "schoolId": "7b7e5a20-f779-410b-b8e1-2edb8a68e12e",
        "schoolName": "Kamarajar Public School-Thedavoor"
    },
    {
        "schoolId": "7bdf83a0-ee7e-4ab2-a096-89178f95a6a1",
        "schoolName": "St. Joseph'S School"
    },
    {
        "schoolId": "7be3430e-3a31-4e80-8901-0b7bc11a82d5",
        "schoolName": "O Khalid Memorial Public School"
    },
    {
        "schoolId": "7c173a2c-b8c5-4f15-af9e-9dd45a2543ac",
        "schoolName": "Monigram Target Mission"
    },
    {
        "schoolId": "7cab3577-3b9b-4aaf-b085-9d363c590fe6",
        "schoolName": "GOOD SHEPHERD SCHOOL"
    },
    {
        "schoolId": "7cf6d672-dfaa-4673-953d-41c0be9c491d",
        "schoolName": "B.V.N"
    },
    {
        "schoolId": "7d244120-ab31-44b6-b229-2b48b923620f",
        "schoolName": "SHREE SHARADHA SCHOOL"
    },
    {
        "schoolId": "7d516ba6-57f0-41eb-b1ac-666590dff73f",
        "schoolName": "Zion English Med.School-Kozhencherry"
    },
    {
        "schoolId": "7d893057-7fdb-4b41-a061-575c2ae7eb9c",
        "schoolName": "Nirmala Convent"
    },
    {
        "schoolId": "7e078d5a-3e19-4d91-8533-017db1e47526",
        "schoolName": "ST.MARK E.M SCHOOL"
    },
    {
        "schoolId": "7e10523c-67ac-4e76-913b-e99692b1e120",
        "schoolName": "Jakkanpur South Point Pub. School"
    },
    {
        "schoolId": "7e4066cb-6c63-4515-b997-59f82097fe35",
        "schoolName": "Sabarigiri K.G. School - Vazhuthacaud"
    },
    {
        "schoolId": "7ea232a7-e31d-4670-80e9-140bd871bfd5",
        "schoolName": "Catherial Mission"
    },
    {
        "schoolId": "7ebac0b7-7de9-41c1-b53a-2500ee27a7ab",
        "schoolName": "Sri Ramana Vidyalaya -RJPM"
    },
    {
        "schoolId": "7f199fd6-e1ad-453b-bf36-645745879584",
        "schoolName": "EBENEZER MARCUS CBSE SCHOOL"
    },
    {
        "schoolId": "7f5a3bef-1037-4a99-b67b-223617141308",
        "schoolName": "Mount Summer Convent"
    },
    {
        "schoolId": "7fb0d1b2-fcac-4ec7-b129-314b0b99c003",
        "schoolName": "Sree Chithira Thirumal Residential School"
    },
    {
        "schoolId": "7fff2fb7-15fd-4629-b8d0-a0ae21307756",
        "schoolName": "GREEN GARDEN"
    },
    {
        "schoolId": "80c20fd7-fd71-4538-be4b-6aeb152f2ae6",
        "schoolName": "astrokids hg school"
    },
    {
        "schoolId": "80db251e-72bb-4841-9cf4-97ead3da2e70",
        "schoolName": "WISDOM MHS SCHOOL"
    },
    {
        "schoolId": "81450ee7-8903-4888-b6d7-f357234cd76b",
        "schoolName": "ERODE HINDU KALVI NILYAM"
    },
    {
        "schoolId": "815e52c1-22bd-4210-bf31-9212192243ba",
        "schoolName": "Purushatam"
    },
    {
        "schoolId": "81914230-9c20-4332-be56-d853f5ad869f",
        "schoolName": "BHARATHI VIDYALAYA MHS SCHOOL"
    },
    {
        "schoolId": "8199f2ad-36f5-4ab4-92d0-b3ab487de711",
        "schoolName": "SRIMATHY PADMAWATHI MHSS"
    },
    {
        "schoolId": "81be8a52-fc34-4bab-bfbf-217a8f713b75",
        "schoolName": "Accademic Hieghts"
    },
    {
        "schoolId": "82453183-fb34-41f5-ab1e-af022722e0c6",
        "schoolName": "Kvn School"
    },
    {
        "schoolId": "82562fc3-6e87-45df-8bea-d2668ec84aa7",
        "schoolName": "KARTHI VIDYALAYA MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "8259c39c-74c0-4c21-a568-7ee1a970b128",
        "schoolName": "K.R.Matric School Madurai"
    },
    {
        "schoolId": "82d4d588-644f-48df-8e44-a9f2de5bc1d9",
        "schoolName": "Sri Ramana Public School"
    },
    {
        "schoolId": "83adf8c2-53f2-4ddd-9e6c-f764116da3ee",
        "schoolName": "National English School"
    },
    {
        "schoolId": "840928f4-6011-468c-9def-4ca871cbd9c9",
        "schoolName": "SHEMFORD FURISTIC SCHOOL"
    },
    {
        "schoolId": "842461c9-1834-4f4a-93b9-b575d1ac641a",
        "schoolName": "GAYATHIRI MATRIC HR SEC SCHOOL"
    },
    {
        "schoolId": "84613f9e-0eb3-492c-9ad5-1ae3697ceb1d",
        "schoolName": "SRI VIDYA N/P SCHOOL"
    },
    {
        "schoolId": "8479565c-83b3-47d8-bf01-904082b2924a",
        "schoolName": "Mca Nawagrh"
    },
    {
        "schoolId": "85147358-912d-427f-8879-928c61e798a2",
        "schoolName": "Crescent Matric School - Nungambakkam"
    },
    {
        "schoolId": "8520a5dc-266e-4c03-9947-16e5797007e4",
        "schoolName": "SIDDARTH PUBLIC SCHOOL"
    },
    {
        "schoolId": "852e2980-2b1c-4b32-a397-50b710da1de7",
        "schoolName": "ST.JOSEPH SCHOOL"
    },
    {
        "schoolId": "854e1d72-64bd-45da-a555-8a2c64700b99",
        "schoolName": "Annai Vellankanni's Matric Hr.Sec.SchoolSaidapet"
    },
    {
        "schoolId": "856f1a03-24e2-420b-8e45-77fa053206d0",
        "schoolName": "Syed Hill View Nur & Pri School"
    },
    {
        "schoolId": "859d0441-e90b-4281-a263-92912f87e379",
        "schoolName": "Baby's Day Out Academy"
    },
    {
        "schoolId": "85b7e46f-02c2-488a-bff4-77e690d1ab3d",
        "schoolName": "Sanjose Public School - Pavaratty"
    },
    {
        "schoolId": "85cab0e7-0c44-46ea-890d-41ccc1c6ec0a",
        "schoolName": "Bright School - IDPL"
    },
    {
        "schoolId": "85cca5b6-b50e-47ac-8bba-c3ec0603e441",
        "schoolName": "AMRITHA SCHOOL"
    },
    {
        "schoolId": "85d7e2c4-6419-4945-976d-b2e81d9b1534",
        "schoolName": "Vijnana Peedom - Sreemolanagaram"
    },
    {
        "schoolId": "85ee0f94-d690-4359-b289-b752126709e7",
        "schoolName": "The Church School"
    },
    {
        "schoolId": "862892a1-3a39-422f-b6ab-e443a5b3a994",
        "schoolName": "Surya School"
    },
    {
        "schoolId": "864b040b-f520-4c58-8ba6-0e990878b15b",
        "schoolName": "St. Marrys Gardiner School"
    },
    {
        "schoolId": "86cf52e7-0c55-4784-8214-796e377f46a0",
        "schoolName": "ST.MERRY CHAKDAH"
    },
    {
        "schoolId": "86fb8b3b-e8f5-411c-a875-4501b185b3f5",
        "schoolName": "DEESHITHA EM SCHOOL"
    },
    {
        "schoolId": "873deff5-abda-4a3d-b1a9-9178fda275ce",
        "schoolName": "Thahani Public School"
    },
    {
        "schoolId": "8764a706-3a58-4687-9725-30247dad7268",
        "schoolName": "Cordova Higher Sec. School - Tvm"
    },
    {
        "schoolId": "87dcd39e-d31a-4ab0-a546-bddf25f08838",
        "schoolName": "V.B.R E.M SCHOOL"
    },
    {
        "schoolId": "8881ebfc-edd4-47e1-b24d-05d5a2ccde21",
        "schoolName": "Francis Academy"
    },
    {
        "schoolId": "889df2b6-b061-4fbb-b940-e923f169387b",
        "schoolName": "LITTLE ANGELS HIGH SCHOOL"
    },
    {
        "schoolId": "890cbea5-9c41-4397-a48e-acde3ed77dbb",
        "schoolName": "Swamy Gopalananda Theertha Saraswathy Vidyanikethan(C.B.S.C) - Aluva"
    },
    {
        "schoolId": "8911e45f-b7ae-45f8-9eea-5053b4dfe935",
        "schoolName": "AVB Matric.Hr.Sec.School-CBE"
    },
    {
        "schoolId": "89758bf1-866c-4c9b-a8e5-fa66811b3819",
        "schoolName": "Fathima Public School - Punalur"
    },
    {
        "schoolId": "8989097b-4cff-4668-85ac-57a84105c35c",
        "schoolName": "ST.JOSEPH ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "898febe4-ac91-4a7b-bb33-ca124752b44f",
        "schoolName": "SPACE CENTRAL SCHOOL"
    },
    {
        "schoolId": "89bf7a75-a7a7-4550-a3e1-e89aef7b22f1",
        "schoolName": "AL AQSA NP SCHOOL"
    },
    {
        "schoolId": "8a046654-863a-4a83-8d24-abb2acab114a",
        "schoolName": "BG National School_"
    },
    {
        "schoolId": "8a273a44-2d0b-40af-8d8b-c0fbac24fb3f",
        "schoolName": "Adams school"
    },
    {
        "schoolId": "8a42952e-432a-4ba2-8a2e-96575a525157",
        "schoolName": "St Augustin"
    },
    {
        "schoolId": "8a51b6c4-fea4-48d6-af3f-5776ad063f4b",
        "schoolName": "vijaya high school"
    },
    {
        "schoolId": "8b30796f-74a5-4d8c-a02c-92020c23e4b2",
        "schoolName": "ROYAL CONCORDE"
    },
    {
        "schoolId": "8b8ade05-caa9-4924-85c2-632028532a39",
        "schoolName": "Marian Day"
    },
    {
        "schoolId": "8c3117b9-3093-45b2-a78d-76b928306554",
        "schoolName": "GRACE PUBLIC SCHOOL"
    },
    {
        "schoolId": "8c580bfa-20fc-4d58-8142-41b34b88967f",
        "schoolName": "Bharath Senior Sec. School - Adyar"
    },
    {
        "schoolId": "8cb9472b-0232-4c1b-81df-2fbfdda86bd5",
        "schoolName": "S.B.O.A. School Annangar"
    },
    {
        "schoolId": "8ccc0475-ea8d-40b9-80a0-737cb50b49bd",
        "schoolName": "INFANT JESUS SCHOOL"
    },
    {
        "schoolId": "8d44263f-19a8-47a2-b5d8-9df1df7d6372",
        "schoolName": "THE PALAKAKD ENGLISH MECIUM SCHOOL"
    },
    {
        "schoolId": "8d597cfc-ef10-4e5d-a4c3-37cb51bb6f85",
        "schoolName": "Dav Gurukul"
    },
    {
        "schoolId": "8d9a4f66-9cc3-42c3-bb07-f24af8f4eca4",
        "schoolName": "Manceera High School"
    },
    {
        "schoolId": "8dbf0caa-c2d8-44d9-acbb-b6289a315024",
        "schoolName": "St. Ann'S Matric Higher Secondary School"
    },
    {
        "schoolId": "8e03e1b7-5c75-4900-b1cd-9b52ff558d31",
        "schoolName": "Premier Vidyaa Vikash Matric.Hr.Sec.School - Uliyampalayam"
    },
    {
        "schoolId": "8e126116-f889-45e5-9b30-845c5ca85838",
        "schoolName": "Navodaya Educational Society"
    },
    {
        "schoolId": "8e2b8752-d129-497f-a4db-fe2507cd76fd",
        "schoolName": "Garden High School"
    },
    {
        "schoolId": "8e6db329-e0a8-4e07-84ec-60696e33c803",
        "schoolName": "St.Mary's Public School-Karukadom"
    },
    {
        "schoolId": "8e767d39-3933-42e6-af1d-5e7de1933066",
        "schoolName": "Bethel Matric. School - Ayanavaram"
    },
    {
        "schoolId": "8e8902b5-ae1a-4cc1-b6ac-987f1c705e12",
        "schoolName": "SSM CENTRAL CBSE SCHOOL"
    },
    {
        "schoolId": "8ea8cc4e-3da3-45ed-b326-e1fc5b2158af",
        "schoolName": "SHANTINIKETHAN SCHOOL"
    },
    {
        "schoolId": "8ec568dd-c5ee-454a-960f-a056518f8dff",
        "schoolName": "RAJAJI VIDYALAYA"
    },
    {
        "schoolId": "8f001a7c-b292-4534-a175-7ba1d208d468",
        "schoolName": "Sadhu Vaswani School"
    },
    {
        "schoolId": "8f2f3b5d-93f2-4871-b8e0-386e0690941f",
        "schoolName": "Ram Prasad Bismil School"
    },
    {
        "schoolId": "8f63da91-9db6-4541-812b-86fea3976faa",
        "schoolName": "RIVER VEW PUBLIC SCHOOL"
    },
    {
        "schoolId": "8f8caeb2-0c64-4ba3-8c26-ccbcc3bf6e46",
        "schoolName": "AKAI SCHOOL"
    },
    {
        "schoolId": "8f9b5a76-0cef-47fe-8cac-bca798b82662",
        "schoolName": "CARMEL CMI ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "9006a767-1fc9-4f1b-afa3-a2a530ffcaba",
        "schoolName": "Deepayan Public School"
    },
    {
        "schoolId": "901c045f-f921-4126-9b01-7c1da82ae7e9",
        "schoolName": "SPK PUBLIC SR SEC SCHOOL"
    },
    {
        "schoolId": "904fdd9c-4bb9-40f3-b491-b6126d2a7366",
        "schoolName": "MIC English School- Akalad"
    },
    {
        "schoolId": "90ad4898-726e-47c9-86a2-9811a034af77",
        "schoolName": "Netaji Pilot School"
    },
    {
        "schoolId": "90bd943c-9823-4e5d-b91c-53e530724549",
        "schoolName": "KV MHSS- Cbe"
    },
    {
        "schoolId": "910f2190-9d1a-4a19-ad42-ae64b4fe310e",
        "schoolName": "Mjrp School"
    },
    {
        "schoolId": "911e1604-596d-468c-a97d-79bdaa1bd254",
        "schoolName": "VIDYA NIKETAN MHS SCHOOL"
    },
    {
        "schoolId": "911f3f98-578d-4ea1-a2dd-2225e5adccf2",
        "schoolName": "Alif School-Manacaud"
    },
    {
        "schoolId": "91273b69-99a9-4ec5-8949-09eee9bfd847",
        "schoolName": "Rosebud"
    },
    {
        "schoolId": "920b0ee8-f755-49d4-beea-4063db1986c7",
        "schoolName": "V.S. Star Public School-Thirukazhukundram"
    },
    {
        "schoolId": "923dcbdc-e238-4ef4-a6f1-5fb38111f4d1",
        "schoolName": "Asphodel School"
    },
    {
        "schoolId": "9246a64e-3cd8-4d43-b218-ec82c37731f3",
        "schoolName": "Jesus & Mary Academy"
    },
    {
        "schoolId": "9254eb59-ef08-4cc2-9050-3e69b9a8ca87",
        "schoolName": "Jyothi public school"
    },
    {
        "schoolId": "926b1c75-8f18-4c8c-b08f-2ba414dfe266",
        "schoolName": "SAI MANIKANTA SCHOOL"
    },
    {
        "schoolId": "92be88fd-89cf-467f-b02e-db8d2c466998",
        "schoolName": "JAYAM ICSE SCHOOL"
    },
    {
        "schoolId": "92bf2991-5578-4bf6-a2d3-e395104aa97a",
        "schoolName": "St. Xaviers School"
    },
    {
        "schoolId": "92c56df9-a045-4212-93e8-1abc2be75f92",
        "schoolName": "Raj Public School"
    },
    {
        "schoolId": "93145d60-40b7-4399-9c4f-e80d3475b396",
        "schoolName": "st martins grammar school"
    },
    {
        "schoolId": "936143be-36f9-4792-86b2-86b45e69de6a",
        "schoolName": "St.Peters English Medium School"
    },
    {
        "schoolId": "93f3fef7-14e9-4988-8e28-8e4fd0222d3c",
        "schoolName": "Mary Ward Public School"
    },
    {
        "schoolId": "93ffe7f3-4041-4c0e-b272-62aa737a9c5d",
        "schoolName": "LITTLE FLOWER SCHOOL"
    },
    {
        "schoolId": "9420af5e-241f-4143-a8bf-542a9bb7cba4",
        "schoolName": "Vijayalakshmi Matric.Hr.Sec. School-Sirumugai"
    },
    {
        "schoolId": "943717ae-ba4e-4170-a643-dbf0f0f91842",
        "schoolName": "Hara gopal"
    },
    {
        "schoolId": "94454ee1-c769-4938-a535-7470bdff426f",
        "schoolName": "Jaimatha Nursery School"
    },
    {
        "schoolId": "949356f3-45b7-4b47-933e-e8585dec02ea",
        "schoolName": "HINDU SR SEC SCHOOL"
    },
    {
        "schoolId": "949a27c4-e9a9-4652-ba46-3123d9081a01",
        "schoolName": "NEW BALDWIN HIGH SCHOOL"
    },
    {
        "schoolId": "95978bc4-52f0-4bde-a06a-d2339dce93b0",
        "schoolName": "Chinmaya Taylors Road"
    },
    {
        "schoolId": "95abdb93-0103-410b-af42-efecda494127",
        "schoolName": "Carmel Residential School - Kottarakara"
    },
    {
        "schoolId": "961f4939-9fb8-4d8d-bdbc-325274d2a564",
        "schoolName": "BEST NURSERY AND HIGH SCHOOL"
    },
    {
        "schoolId": "969e52e1-8b57-46d8-8096-23c7ac7a7bdb",
        "schoolName": "Christ Nagar Central School"
    },
    {
        "schoolId": "96ffe748-2aa9-46a3-8681-f0e8e7221a63",
        "schoolName": "Thanveer Central School-Oachira"
    },
    {
        "schoolId": "973f6da1-1f8b-485e-8d12-64ed518d30c6",
        "schoolName": "V.M. Public School - Muvattupuzha"
    },
    {
        "schoolId": "974a05b8-dc25-4ce3-ab24-04ccc61c4be8",
        "schoolName": "Usa Vidya Mandir"
    },
    {
        "schoolId": "9774776c-8dcb-4820-a386-532cd71ad9ea",
        "schoolName": "Jahan Public School"
    },
    {
        "schoolId": "97b4aa3f-04ee-4fc3-ab2b-9d0a30de596d",
        "schoolName": "JOHN DEWEY INTERNATIONAL CBSE SCHOOL"
    },
    {
        "schoolId": "97cb1754-1ebf-43e1-afc4-e25a42f76cbf",
        "schoolName": "Ambition Public School"
    },
    {
        "schoolId": "981ee957-1c15-4348-a24f-4e3ce56976f8",
        "schoolName": "SREE VISVESVARYA INTERNATIONL SCHOOL"
    },
    {
        "schoolId": "9821de0a-efce-4b83-81d4-036d37a45b3b",
        "schoolName": "Jaya Matric.Hr.Sec.School-Tiruninravur"
    },
    {
        "schoolId": "988a01eb-37f5-47e1-b7ba-a1b3f240b96e",
        "schoolName": "PRASIDDHI VIDYODAYA"
    },
    {
        "schoolId": "9891d24a-e0fd-400b-a250-3f352dbd9cba",
        "schoolName": "MAHATMA GANIDHI PUBLIC SCHOOL"
    },
    {
        "schoolId": "98c80c68-faaa-45f0-b8d8-3df63c4999b8",
        "schoolName": "St.Elizabeth English Medium School"
    },
    {
        "schoolId": "98f3b13f-6a2e-4e97-aa28-6952d9b236ac",
        "schoolName": "HOLY INNOCENT PUBLIC SCHOOL- VENNICODE"
    },
    {
        "schoolId": "994d49d8-d7a7-443b-be2b-924f5cf123b0",
        "schoolName": "IG ENGLISH SCHOOL"
    },
    {
        "schoolId": "99a9351d-bf6b-4e37-9d63-62ead3c19cd9",
        "schoolName": "St.Christ Public School"
    },
    {
        "schoolId": "99b74a3a-d52e-47f4-8972-cc4ff69511c7",
        "schoolName": "VIRTHU PUBLIC SCHOOL"
    },
    {
        "schoolId": "99f4d385-e2fc-49b3-81b6-389de30fa550",
        "schoolName": "Jeevan Pragathi Golden International School"
    },
    {
        "schoolId": "9a123614-5301-4e15-96da-a305a04bc351",
        "schoolName": "I C C PUBLIC SCHOOL"
    },
    {
        "schoolId": "9a3a2a5c-5c1e-411c-8b41-b26b6d6ea5aa",
        "schoolName": "Swami Vivekananda Academy"
    },
    {
        "schoolId": "9a61226d-2f30-43df-a5d8-ac19fcb40c6e",
        "schoolName": "Holi Child English Academy"
    },
    {
        "schoolId": "9a7f640d-0929-4218-ba85-1c1360d3b30a",
        "schoolName": "CM CENTRAL SCHOO"
    },
    {
        "schoolId": "9aad7bee-96d0-4ce7-9a4b-5ade329dd2c2",
        "schoolName": "St Maria School"
    },
    {
        "schoolId": "9abeae89-a8aa-4ee9-b3ae-ae0095bc43f5",
        "schoolName": "Siddharth High School - Medak"
    },
    {
        "schoolId": "9b04139e-4d8d-4edf-a7af-aeffaaa129a3",
        "schoolName": "takshasila hg school"
    },
    {
        "schoolId": "9c3c1982-369c-4a7f-9a6a-11db75777210",
        "schoolName": "Bharathiyar Hi Tech School - Cbse"
    },
    {
        "schoolId": "9c7a98ef-6e0e-428a-9f9c-5d8fc2039260",
        "schoolName": "Bodhisukha School"
    },
    {
        "schoolId": "9d1eeb80-3d39-4e0d-9206-da65618028ab",
        "schoolName": "Rajabazar Boys & Girls"
    },
    {
        "schoolId": "9d36e60c-6253-4fff-bb58-e1f6cccb7a7d",
        "schoolName": "St. Johns School - Karambakkam"
    },
    {
        "schoolId": "9d986121-53f1-47a0-9600-812a47bc03f6",
        "schoolName": "Shree Gugan School"
    },
    {
        "schoolId": "9db2957b-34ad-4e77-b90c-24f273fa396b",
        "schoolName": "Isl Sudhamdhi"
    },
    {
        "schoolId": "9ddb4630-6b35-4d32-88f1-4815ebe6447c",
        "schoolName": "Little Dimond School"
    },
    {
        "schoolId": "9e79c869-c906-430f-96c1-bf22fb312a97",
        "schoolName": "Don Bosco Matric. Hr.Sec. School"
    },
    {
        "schoolId": "9e7a5f36-5b6f-4ec3-863d-20bfdb2fecd5",
        "schoolName": "SWITTZER E.M SCHOOL"
    },
    {
        "schoolId": "9e7c1cb0-c1f7-46aa-ae5b-b22606077007",
        "schoolName": "CSI GIRLS MHS SCHOOL"
    },
    {
        "schoolId": "9ee43ba8-eaa5-430d-bc2d-6894f834b217",
        "schoolName": "kennedy the global school"
    },
    {
        "schoolId": "9febcd93-52bb-44db-bd16-e2e3e2065f94",
        "schoolName": "LITTLE ANGLES"
    },
    {
        "schoolId": "a01eb1f7-0bf8-4e96-a5f5-a094bebbc445",
        "schoolName": "Sree Vivekakanda Memorial Public School"
    },
    {
        "schoolId": "a03bddb3-f19c-4970-bbdb-e686945feebc",
        "schoolName": "Gwalior Glory School"
    },
    {
        "schoolId": "a06619e6-ab22-4cfe-acc4-49c6295797f1",
        "schoolName": "SREE VENKITACHALAPATHY DEVASOM VIDYANIKETAN"
    },
    {
        "schoolId": "a06b761f-0e78-4980-8e9b-0f236f9cf17d",
        "schoolName": "PARK POINT"
    },
    {
        "schoolId": "a111a7f5-f7c2-40d9-9b15-29c0c441994e",
        "schoolName": "Fathima Public School"
    },
    {
        "schoolId": "a12dbb86-da78-4cde-a090-2c3e05a3fd2f",
        "schoolName": "LAJPAT INSTITUTION"
    },
    {
        "schoolId": "a19dd891-988c-4683-ad6a-d527b5f6bd7f",
        "schoolName": "Sr. Radiant Academy"
    },
    {
        "schoolId": "a1f7b6f3-0f03-4a4a-aec9-a01cd7957666",
        "schoolName": "Newton group school"
    },
    {
        "schoolId": "a294b853-9571-4d51-8435-9e4f23e490e5",
        "schoolName": "Dav Anil Public School"
    },
    {
        "schoolId": "a2b19ebd-b80a-4e3b-a915-58addbe963ae",
        "schoolName": "Amrit Vani School"
    },
    {
        "schoolId": "a305d030-c941-4edf-88b6-2af34d30bac1",
        "schoolName": "MYMA ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "a33f7154-4fd7-4e59-8424-c337f1a0bc97",
        "schoolName": "Hirange School"
    },
    {
        "schoolId": "a3735c7b-873f-43be-bf6a-c206c958027c",
        "schoolName": "Jspm Group"
    },
    {
        "schoolId": "a3791e9d-7239-436e-82ee-49732be70bfb",
        "schoolName": "S.B.I.O.A. International School - Mambakkam"
    },
    {
        "schoolId": "a3c7e71a-ab49-4095-91cf-a7ea997b5b2d",
        "schoolName": "Sri Vidya Mandir Sr. Sec.School"
    },
    {
        "schoolId": "a439142b-ec13-41ce-9534-5b45c34d01d2",
        "schoolName": "VENKAT INTERNATIONAL"
    },
    {
        "schoolId": "a47b6bcf-d59c-428a-a4b8-c9b9ebbf796e",
        "schoolName": "Siddharth School"
    },
    {
        "schoolId": "a4a527d9-a736-4f66-9d8c-710ece6aa5ae",
        "schoolName": "Sri Sankara Matric School"
    },
    {
        "schoolId": "a50c1127-157c-44ab-9d51-81f346d7b06c",
        "schoolName": "Ps Desh Mukh School"
    },
    {
        "schoolId": "a525fd92-42a4-46aa-a823-d5b12992b30c",
        "schoolName": "HAYAGRIVAR MATRIC SCHOOL"
    },
    {
        "schoolId": "a5530fb5-d7d1-4998-bb08-3c62575dfeb8",
        "schoolName": "LEO MHS SCHOOL"
    },
    {
        "schoolId": "a5b28477-6319-411b-b3ba-60459c5dbf81",
        "schoolName": "P.S. Matric School"
    },
    {
        "schoolId": "a6030b89-1b6e-41b0-aa3c-f9ed7802b335",
        "schoolName": "AL NOOR N/P SCHOOL"
    },
    {
        "schoolId": "a6371dc7-d4e0-47ef-851a-f751b45c1595",
        "schoolName": "RANI MATHA PUBLIC SCHOOL"
    },
    {
        "schoolId": "a69560dd-e629-4948-8135-62d3b745654a",
        "schoolName": "SABARI CENTRAL SCHOOL"
    },
    {
        "schoolId": "a70feefa-0ba4-4f1d-a367-1f05979a4c69",
        "schoolName": "KONGU INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "a757393c-b9ce-4473-8ca7-2685da35eee8",
        "schoolName": "Indian Sacred Mission"
    },
    {
        "schoolId": "a7679369-9fbc-4990-980a-dc1730f53154",
        "schoolName": "Ideal School Sherpur"
    },
    {
        "schoolId": "a7b8be7a-b1af-4dd7-a470-492ab2ea7c75",
        "schoolName": "SANJOSE ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "a7ed32ad-ba4c-4c53-a89b-30f4807e1b3f",
        "schoolName": "S N Public School"
    },
    {
        "schoolId": "a80da2da-1677-4d4a-8d95-3868ae9067cc",
        "schoolName": "Zion"
    },
    {
        "schoolId": "a8a45201-8fb3-4d42-8369-49c19b8b8801",
        "schoolName": "Agarwal Public School"
    },
    {
        "schoolId": "a93cd06a-c0f2-477a-ad64-9bf78212796f",
        "schoolName": "SFS SCHOOL"
    },
    {
        "schoolId": "a96b22b3-170b-44c9-84a8-23431a5d8d0c",
        "schoolName": "Brightland School"
    },
    {
        "schoolId": "a9da2010-6147-4ccc-b806-5189fc84714e",
        "schoolName": "Carmel International School - Punnapra"
    },
    {
        "schoolId": "aa03c272-a4a4-4696-910e-9e3a2821b58c",
        "schoolName": "Cambrize Public School"
    },
    {
        "schoolId": "aa823d06-1f16-43c5-b156-84b5755e2e00",
        "schoolName": "SSV Matric School- Melur (N & P)"
    },
    {
        "schoolId": "aa856184-b8cc-4dc7-a172-cf9180a02f7e",
        "schoolName": "O.MOHANRAJ MATRIC SCHOOL"
    },
    {
        "schoolId": "aab5e7fc-0a29-43ef-a444-ad116c9cedd1",
        "schoolName": "River view sc"
    },
    {
        "schoolId": "aabe4a09-df60-4b04-a289-ff220827a0dc",
        "schoolName": "Hindmotor High School"
    },
    {
        "schoolId": "aafe0cdd-3756-4867-b81d-09937d20bd7d",
        "schoolName": "ROULATHUL ULOOM ENGLISH SCHOOL"
    },
    {
        "schoolId": "ab2270de-5d04-4c87-a54e-89248bd98a49",
        "schoolName": "St Jhon School"
    },
    {
        "schoolId": "ab3dbbcd-fa53-4c4f-90ef-3ebba2898049",
        "schoolName": "JOHN DEWEY MAT HR SEC SCHOOL"
    },
    {
        "schoolId": "ab4f6ab5-53f6-4dd9-9060-ccbfee270f28",
        "schoolName": "VIDYAKENDRA PUBLIC SCHOOL"
    },
    {
        "schoolId": "ab70c822-7f8f-4134-8b5e-636e692ce4ad",
        "schoolName": "Jindal School"
    },
    {
        "schoolId": "ab8e7533-1b94-4f40-afa8-b264b6179afa",
        "schoolName": "Shanti Memorial"
    },
    {
        "schoolId": "abcacdcd-619e-46be-9929-9bd95912dc06",
        "schoolName": "Silver Bells"
    },
    {
        "schoolId": "ac168f70-3479-40d6-aaa7-0f94b47422e8",
        "schoolName": "GSM school"
    },
    {
        "schoolId": "ac44f342-3af8-4d2a-84ac-5512cca52142",
        "schoolName": "International Indian School"
    },
    {
        "schoolId": "acfecf17-7e75-4a8e-ac8b-679db4cc189d",
        "schoolName": "Southside CBSE School- Mettamalai"
    },
    {
        "schoolId": "ad2b9c16-c315-4d35-bf92-61a014762b84",
        "schoolName": "Anthony Public School"
    },
    {
        "schoolId": "ad2f015a-d52a-466c-bd59-d3b2b85acb5c",
        "schoolName": "Blue Bell School"
    },
    {
        "schoolId": "adbe7cb3-cd1a-4b68-abb9-5185d5b5c83e",
        "schoolName": "KRISHNAVENI TALENT HIGH SCHOOL"
    },
    {
        "schoolId": "ae13259a-b1bf-4b1a-a8c5-ca2adaee5950",
        "schoolName": "Indira Gandhi Memoria -Madurai"
    },
    {
        "schoolId": "ae769d30-55c8-48a2-b32e-7edabaf57f5a",
        "schoolName": "Velammal Mat.Hr.Sec.School-Mogappair West"
    },
    {
        "schoolId": "ae96d9d2-78bf-461c-8838-1d3e5965abc5",
        "schoolName": "KINGSTON MHS SCHOOL"
    },
    {
        "schoolId": "aebeff11-f6c6-4f2a-a446-30371ded236f",
        "schoolName": "RAVI HIGH SCHOOL"
    },
    {
        "schoolId": "aec1eb1a-4581-482c-b98b-2f618c1b114f",
        "schoolName": "RGR CBSE DREAM SCHOOL"
    },
    {
        "schoolId": "af806768-fd0b-4e9f-b2fd-e57582a8e414",
        "schoolName": "Dpa Kids"
    },
    {
        "schoolId": "afcf12a3-0c3f-44e3-8f4f-dfa7e8f3ea35",
        "schoolName": "The Sivakasi Lions Matric School- Sivakasi"
    },
    {
        "schoolId": "afd71a3a-9e5f-4cbc-9139-a45b542a1f99",
        "schoolName": "KSV MHS SCHOOL"
    },
    {
        "schoolId": "afdc843b-2881-4aae-9e12-0f6d9339c1cd",
        "schoolName": "AXILUM NAVAJOTHI EMS"
    },
    {
        "schoolId": "afe6a217-b285-4f23-831e-c2ba946bc347",
        "schoolName": "jalappa"
    },
    {
        "schoolId": "b028715f-2524-4971-968a-3c7b57e4d858",
        "schoolName": "Coast Guard Kinder Garden School-Royapuram"
    },
    {
        "schoolId": "b0327476-247a-4756-828e-07a481cc9e9a",
        "schoolName": "A.R.L.M. Matric.Hr.Sec.School"
    },
    {
        "schoolId": "b065073e-e9a7-4531-8e5e-1708bcb8c2c3",
        "schoolName": "VISWAM E.M SCHOOL"
    },
    {
        "schoolId": "b0848afe-586d-4662-8c6d-abda1bdcaa3a",
        "schoolName": "SIET MHSS"
    },
    {
        "schoolId": "b0a484d0-8474-49af-8619-0801fb00e3d1",
        "schoolName": "Maria Teresa Scrilli Public School-EKM"
    },
    {
        "schoolId": "b0b3b438-5ee3-42cd-92bc-3d536c6f0707",
        "schoolName": "MARY MARTHA CMI PUBLIC SCHOOL"
    },
    {
        "schoolId": "b0cd49ff-4c46-4803-b3c1-17bb9c6fccbd",
        "schoolName": "ST.ANTONY ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "b0dcedc2-11ac-4a44-9c58-d24d9e6c0a88",
        "schoolName": "SWARGARANI SCHOOL"
    },
    {
        "schoolId": "b109e7d0-8520-4264-8098-a60387785120",
        "schoolName": "PREKSHITHAMATHA SCHOOL -KOLLAM"
    },
    {
        "schoolId": "b1cbdd45-0227-4033-a17e-ebe274006cd0",
        "schoolName": "Idayam Rajandran School"
    },
    {
        "schoolId": "b1d68a72-0e17-4d3b-80c0-c31aecb0ad14",
        "schoolName": "BEST MHS SCHOOL"
    },
    {
        "schoolId": "b2002464-3951-49c3-aae5-8587533cd57e",
        "schoolName": "Nav Bharath Vidyalaya Matric.Hr.Sec.School-Mangadu"
    },
    {
        "schoolId": "b2269c92-c31e-4cb9-a845-0f95bd8e4f1d",
        "schoolName": "Sunshine School"
    },
    {
        "schoolId": "b24d7958-76a1-4745-88ef-f02f81525f02",
        "schoolName": "Pranavi English Medium School"
    },
    {
        "schoolId": "b274a7a5-acb3-4c68-b44a-95bbd900990c",
        "schoolName": "SIDDHARTH PUBLIC SCHOOL"
    },
    {
        "schoolId": "b2a12cf2-628a-4072-86bb-403c7813b6a0",
        "schoolName": "ST.LUIGI SCHOOL"
    },
    {
        "schoolId": "b2b8597b-6a0d-49ce-967a-b245827ddf7a",
        "schoolName": "Dr. Abdul Kalam Matric. School"
    },
    {
        "schoolId": "b364b9bf-57c5-4a33-9299-eb9a7a9662cc",
        "schoolName": "Littel Flower"
    },
    {
        "schoolId": "b441138c-1133-4694-ae45-c587efa6a4f3",
        "schoolName": "Swarnim Public School"
    },
    {
        "schoolId": "b4b1935e-e4af-458e-8fb8-20a78fe7cd15",
        "schoolName": "Janapriya Montessori"
    },
    {
        "schoolId": "b4fb69bc-8af8-49f2-b09b-42de711b4676",
        "schoolName": "Safa English Medium School"
    },
    {
        "schoolId": "b559188e-4529-439a-9b40-eeae924191fe",
        "schoolName": "St. Paul School"
    },
    {
        "schoolId": "b5a128a7-9d46-4b3e-a8b7-9e94994aedb1",
        "schoolName": "K.S.P.International School"
    },
    {
        "schoolId": "b5a85e0f-a864-4e3e-80f7-c251c27312b0",
        "schoolName": "SUNRISE ENGLISH SCHOOL"
    },
    {
        "schoolId": "b6019307-e9d4-4f06-a719-44f2469e4d12",
        "schoolName": "Aryan School"
    },
    {
        "schoolId": "b60319ca-d744-4ff0-8009-1ec34a4e8823",
        "schoolName": "KIDDIEKOOP HIGH SCHOOL"
    },
    {
        "schoolId": "b605c528-2f03-4748-a72c-341e379bf9e9",
        "schoolName": "ABHYASA HIGH SCHOOL"
    },
    {
        "schoolId": "b6191d6b-9aa6-4090-8421-e6843f7ec38e",
        "schoolName": "K. T. T. P. S."
    },
    {
        "schoolId": "b62b9328-f2bb-4532-be19-7995092b6ec5",
        "schoolName": "GREEN HILLS PUBLIC SCHOOL"
    },
    {
        "schoolId": "b72cd1d7-1917-4803-a16c-d767d673ef1b",
        "schoolName": "The Schram Academy-Madurovoyal"
    },
    {
        "schoolId": "b7a317b4-95ad-4328-8bff-7db754fa8dbe",
        "schoolName": "AWNIYYA PUBLIC SCHOOL"
    },
    {
        "schoolId": "b7e4fd77-1d1f-4aeb-89bb-842b0ee6c9b6",
        "schoolName": "St Paul & Kg School"
    },
    {
        "schoolId": "b818db53-a3da-4341-be97-149aa22a8303",
        "schoolName": "MNR School"
    },
    {
        "schoolId": "b8401778-9452-470b-b23e-ce822730421e",
        "schoolName": "Our Lady of Mercy School - Aroor"
    },
    {
        "schoolId": "b84887d3-8bca-4d76-b92a-8c766d31792a",
        "schoolName": "ST MATHEW CONVENT"
    },
    {
        "schoolId": "b8a1bfb8-c2cf-4d74-b6ce-923dd12f89c2",
        "schoolName": "A.G. Church"
    },
    {
        "schoolId": "b8b6ab94-cc89-48c1-9740-44139177f700",
        "schoolName": "CRESCENT PUBLICS SCHOOL"
    },
    {
        "schoolId": "b8dbd39c-6f33-4f0f-868d-ec245cbd757b",
        "schoolName": "STAR MHS SCHOOL"
    },
    {
        "schoolId": "b918041f-9a4d-4d24-b4f9-e6f2d02613be",
        "schoolName": "INDIRA GANDHI"
    },
    {
        "schoolId": "b94e242a-e183-4e43-9a03-7a2805c27028",
        "schoolName": "Netaji Pilot School"
    },
    {
        "schoolId": "b9588d96-e226-4c92-88df-6ff2682ca624",
        "schoolName": "AASIA BAI HIGHER SECONDARY SCHOOL"
    },
    {
        "schoolId": "b9815e6a-6a28-458d-805c-28c6e73ecdea",
        "schoolName": "Akshara The School-Jeedimetla"
    },
    {
        "schoolId": "b9a7be17-5af9-4874-8f99-bd1706c6b527",
        "schoolName": "VIKASA SCHOOL"
    },
    {
        "schoolId": "b9bda6ac-fa62-4a36-b529-9ce95b76ecca",
        "schoolName": "Gedee Public School - Eachanari"
    },
    {
        "schoolId": "b9f233c2-3659-48a5-9044-4776dbbe2356",
        "schoolName": "Sarvodya Public School"
    },
    {
        "schoolId": "ba0f7c91-ff91-4628-8f47-2c3ab0d4e256",
        "schoolName": "CRESCENT GIRLS MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "ba0ff160-6441-41e1-b22a-b6dfba1498a0",
        "schoolName": "PRASAD SCHOOL"
    },
    {
        "schoolId": "ba5d2bb0-aaf9-4841-8979-5dc5a1d7f78a",
        "schoolName": "CO.OPERATIVE EMGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "bb32ca9d-c291-44ea-9469-7bc7b6b8bec2",
        "schoolName": "Sri Sushwani Matha Jain -Puliyanthope"
    },
    {
        "schoolId": "bb405fd5-ac14-49c8-8806-b5ded04af2af",
        "schoolName": "A J Higher Secondary School"
    },
    {
        "schoolId": "bb57e922-0884-4d1a-bfa7-df65ae18bbae",
        "schoolName": "Sardha Gyan School"
    },
    {
        "schoolId": "bbeb6978-4fe1-41c1-a7e9-7b2c0a100dc6",
        "schoolName": "SHANTIPUR ACADEMY"
    },
    {
        "schoolId": "bc14ae27-0496-48c0-9d15-5f8ce53d2f7f",
        "schoolName": "PRABATH RESI PUBLIC SCHOOL"
    },
    {
        "schoolId": "bcda9511-5551-488c-9d1a-b9dc7ef2a7ef",
        "schoolName": "Chinmaya School"
    },
    {
        "schoolId": "bd14b03e-871a-4950-aa56-507afcaa30fc",
        "schoolName": "Soyana School"
    },
    {
        "schoolId": "bd51187b-4366-4d74-8fab-a37680045233",
        "schoolName": "St.Joseph Matriculation School-Venthanpatti"
    },
    {
        "schoolId": "bd76e8ea-dd7b-4a51-a65b-56623b04fd2a",
        "schoolName": "Gyatri School"
    },
    {
        "schoolId": "bd905041-998d-49e2-96a9-a1088b19d246",
        "schoolName": "JHONSON GLOBAL SCHOOL"
    },
    {
        "schoolId": "be4bbeff-e6e9-43d8-add4-e95d73d4cf81",
        "schoolName": "V.B.R.International School"
    },
    {
        "schoolId": "be801c3c-acdd-44d8-974e-024fb4e121e9",
        "schoolName": "Crescent Eng. School"
    },
    {
        "schoolId": "be9c055f-62ae-43d4-82da-29f5018f2aff",
        "schoolName": "SINDHU VIDYALAYAM"
    },
    {
        "schoolId": "bebb5eaa-bd97-407c-9a1f-e3725eadff0b",
        "schoolName": "FLIX E.M SCHOOL"
    },
    {
        "schoolId": "beef9dd1-8d4a-47de-aee9-47eef66bc048",
        "schoolName": "VIGNAN SCHOOL"
    },
    {
        "schoolId": "bf0425bf-b235-4176-86b5-c5e75ff166f9",
        "schoolName": "ST. PETERS ICSE SCHOOL"
    },
    {
        "schoolId": "bf1567f3-1e6d-4694-be96-a5082ca37a6a",
        "schoolName": "St. Francis A.I"
    },
    {
        "schoolId": "bf338cc0-1e9b-4d35-917d-d57b7c50eb24",
        "schoolName": "SRI SHOBHA E.M SCHOOL"
    },
    {
        "schoolId": "bf77c134-9b1f-41a0-9420-30a870a16cf0",
        "schoolName": "Bradford School"
    },
    {
        "schoolId": "bf901519-d8b4-4f0c-abac-2fee41054695",
        "schoolName": "Good & Great Academy"
    },
    {
        "schoolId": "bf939730-96ce-47cc-939d-c4ddb9fc23b5",
        "schoolName": "Monarch School Of Human Excellence"
    },
    {
        "schoolId": "c01c2627-0b8a-4e00-8733-1447400ddf0f",
        "schoolName": "VIVEKANANDA VIDYA MANDIR"
    },
    {
        "schoolId": "c045becf-fc36-4c1e-92a1-33cab5936b5b",
        "schoolName": "SRI SATHIYA SAI MATRIC SCHOOL"
    },
    {
        "schoolId": "c0572054-68d7-4691-8bf0-4330bde2412d",
        "schoolName": "Sri Sankar's Vidyalaya Hr Sec School"
    },
    {
        "schoolId": "c0afba46-47fc-4401-846e-941855edefb5",
        "schoolName": "YRTV School-Sivakasi"
    },
    {
        "schoolId": "c10cead4-ea96-4741-9c34-d725015978e3",
        "schoolName": "BHARATH CBSE SCHOOL"
    },
    {
        "schoolId": "c126f855-e1bc-4af9-ab77-dec34b880d59",
        "schoolName": "Royal International school"
    },
    {
        "schoolId": "c16302cb-7b80-4ed3-9664-b09f05d17430",
        "schoolName": "Sri Krishna Niketan"
    },
    {
        "schoolId": "c1eca71e-5fd3-4d2c-b7bb-5b03e13f48d5",
        "schoolName": "Us Ostwal School"
    },
    {
        "schoolId": "c1f30a72-5d5b-42c4-8d8f-f29b7a1dae97",
        "schoolName": "Chinmaya Group"
    },
    {
        "schoolId": "c1f64af5-973f-4d7a-b2c6-b8ec1c4f8c97",
        "schoolName": "Amar Jothi School"
    },
    {
        "schoolId": "c218ab3e-c7fc-4517-88bd-3034c0b5d6b1",
        "schoolName": "MARKEZ INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "c2a4c0f0-9d94-45bb-ace6-b5e19f62b00f",
        "schoolName": "St. Joseph Public School - Pollethai"
    },
    {
        "schoolId": "c2a5e672-2935-4f11-9c1e-29f336181b8d",
        "schoolName": "MANAGALAM CBSE SCHOOL"
    },
    {
        "schoolId": "c2c6402a-7faf-4fd4-8227-c3697246ba5d",
        "schoolName": "West Point Academy"
    },
    {
        "schoolId": "c2fa863a-7e51-4d66-b863-23ded658a6ea",
        "schoolName": "St. Anns Public School - Cherthala"
    },
    {
        "schoolId": "c31057e5-4cb0-442a-aa7b-6082da4a54f0",
        "schoolName": "SPK KIDS SCHOOL"
    },
    {
        "schoolId": "c32e8efc-c874-4732-8240-01d8cfef5e89",
        "schoolName": "ST.Marys"
    },
    {
        "schoolId": "c35e23b6-05a5-44b7-a3e9-75bfeb2a5664",
        "schoolName": "CRESCENT ENGLISH SCHOOL"
    },
    {
        "schoolId": "c361122c-0e85-4c41-81a5-b942a867ad73",
        "schoolName": "Ganga School"
    },
    {
        "schoolId": "c370c51f-89fc-4c5f-96ee-8b449d415452",
        "schoolName": "New National School"
    },
    {
        "schoolId": "c38a31cf-7196-416a-b8a5-531a221660e8",
        "schoolName": "Bhathavatchalam School"
    },
    {
        "schoolId": "c3f4d737-7e8f-4a0a-9ce9-80ac7766b885",
        "schoolName": "The Swiss Central School"
    },
    {
        "schoolId": "c4064a4a-c699-4a4d-9e3c-547d4441b091",
        "schoolName": "Vani Alapakkam"
    },
    {
        "schoolId": "c435aec0-2eb4-429d-9f7e-ac3045f6b91d",
        "schoolName": "Krishnasamy Mat Hr Sec Sch of Excellence"
    },
    {
        "schoolId": "c4605d3d-a6d0-4229-b869-131b10f8e859",
        "schoolName": "SHIRISHTI CBSE CHOOL"
    },
    {
        "schoolId": "c48a6c59-f6a3-46b6-869e-306462c23fbc",
        "schoolName": "WMO GREEN MOUNT PUBLIC SCHOOL"
    },
    {
        "schoolId": "c48fcded-63c4-4fd4-9440-4fca40d9b938",
        "schoolName": "New Horiozon"
    },
    {
        "schoolId": "c4b524f7-857a-4675-9b55-0705c0674f54",
        "schoolName": "SHANTHI VIDYALAYA"
    },
    {
        "schoolId": "c51a3aa1-28a1-4ba5-8580-2b1205468979",
        "schoolName": "Brotherhood Matric School"
    },
    {
        "schoolId": "c51b6795-1047-47c2-8b16-f1313d977303",
        "schoolName": "St Michael'S School"
    },
    {
        "schoolId": "c551281c-51a3-4d6b-a18e-3bc13dbf51bb",
        "schoolName": "Guru Saraan Public School-Kalapatti"
    },
    {
        "schoolId": "c5aeeff2-a7eb-48e6-8c4f-bc8bdd678ebb",
        "schoolName": "DARUL SALAM ENGLISH MECIUM SCHOOL"
    },
    {
        "schoolId": "c5d72c83-bd36-4c60-b5c1-4f738f7cab8a",
        "schoolName": "St. Mary's Residential Public School - Paliakara"
    },
    {
        "schoolId": "c5dd6f14-e5a3-4cb9-a81f-7a37e44cae38",
        "schoolName": "Savio English School-Kozhencherry"
    },
    {
        "schoolId": "c64e7fa0-1ecb-40df-bd6d-2e353d6c8140",
        "schoolName": "Senet Blooming Academy"
    },
    {
        "schoolId": "c6a502e7-ffd1-4c69-865c-283cee3da953",
        "schoolName": "New balwin school"
    },
    {
        "schoolId": "c6a62b08-c182-4fe6-8c83-c5d10ab07af3",
        "schoolName": "AMRITA VIDYALAM"
    },
    {
        "schoolId": "c6c9a60f-c835-4784-b095-18932c15f260",
        "schoolName": "Measi Matric Hr.Sec.School"
    },
    {
        "schoolId": "c717d18a-83c3-436c-a693-48a3d651298c",
        "schoolName": "Mahatma Vidyalaya Nursery & Primary School-Srivilliputhur"
    },
    {
        "schoolId": "c74d596e-2677-499f-b4a2-09774b2905cd",
        "schoolName": "Uma Public School"
    },
    {
        "schoolId": "c77dc8fe-4852-452e-98ff-3ea42acd9b5c",
        "schoolName": "Lbs School"
    },
    {
        "schoolId": "c78ab225-c1ba-40c5-8fec-182ce1854d10",
        "schoolName": "Nirmala Public School Pizhak"
    },
    {
        "schoolId": "c7d9c03f-7c82-46c9-bd58-7d7a5c6090f1",
        "schoolName": "Sadaf Public School"
    },
    {
        "schoolId": "c813ac23-cba7-47d6-8bbc-c287b4d285e7",
        "schoolName": "Velammal Mat.Hr.Sec.School-Mogappair"
    },
    {
        "schoolId": "c8140668-b29f-41bf-bc9e-9028d7979260",
        "schoolName": "Little Angels High School"
    },
    {
        "schoolId": "c837219c-698a-4bfc-9c8e-9dbb56435426",
        "schoolName": "K.S.P.Hr.Sec.School"
    },
    {
        "schoolId": "c84e5666-8830-47b5-8dd6-9bdd92774bf2",
        "schoolName": "St.Bede's Anglo Indian Hr.Sec.School"
    },
    {
        "schoolId": "c88703dc-d8e7-4463-9042-2e560a93982b",
        "schoolName": "Apsara Public School"
    },
    {
        "schoolId": "c8de434c-cd6c-49b1-ac3e-be81e842f669",
        "schoolName": "Pierre Paul Public School"
    },
    {
        "schoolId": "c8e03392-a4b9-4a53-9708-5c423a911478",
        "schoolName": "Vimala Hridaya English Medium School"
    },
    {
        "schoolId": "c90ab5a5-699a-414d-b6f5-fbb803591d7d",
        "schoolName": "D. P. S. - Howrah"
    },
    {
        "schoolId": "c90ac7ea-bcfd-49a3-9c9d-929868f63e55",
        "schoolName": "Saraswathy Vidhyalaya"
    },
    {
        "schoolId": "c9692e0d-d4f3-4cca-9598-cd7081206a0d",
        "schoolName": "E.S Lords International School-Cbse"
    },
    {
        "schoolId": "c9b13ae3-a510-4dba-a28a-5114f09316cb",
        "schoolName": "C.B.Singh Gaur Public School"
    },
    {
        "schoolId": "ca06ced3-0379-469e-be83-0c36e1ee7883",
        "schoolName": "BELL & BENET E.M SCHOOL"
    },
    {
        "schoolId": "cac819e6-fa79-41ca-aaa0-cad1706a5294",
        "schoolName": "Galaxy Group School"
    },
    {
        "schoolId": "cade8811-a32d-4c80-b3a8-87442b35e30e",
        "schoolName": "SAI VIDYANIKETHAN"
    },
    {
        "schoolId": "cae4c5aa-34b5-40bb-a2cc-8207660454a3",
        "schoolName": "Scholar Home"
    },
    {
        "schoolId": "cb5f3f12-a097-4e1e-ba0b-f47512d46750",
        "schoolName": "CENTURY FOUNDATION N&P"
    },
    {
        "schoolId": "cb78cfa7-2107-4379-bb61-e87e910e606e",
        "schoolName": "Christ Nagar Central School"
    },
    {
        "schoolId": "cb9a2902-e899-4710-be39-dd5c684e7a83",
        "schoolName": "Silverheights Public School"
    },
    {
        "schoolId": "cbbd506d-5d05-4961-9109-88a46db85253",
        "schoolName": "St.Patrick's ICSE -Adyar"
    },
    {
        "schoolId": "cbdfd3a2-f3aa-4f42-8cf1-365a30e7c2a8",
        "schoolName": "The Salonee School-Banglore"
    },
    {
        "schoolId": "cc2c56e6-5079-40f8-9dbc-3affbc74beec",
        "schoolName": "NATIONAL VIDYALAYA"
    },
    {
        "schoolId": "cc3fac95-20fc-4fe1-95bc-2955d2b15c6a",
        "schoolName": "Pros Poro School"
    },
    {
        "schoolId": "cc52771d-8a5d-4781-ba36-91b73c264fe3",
        "schoolName": "Itty Bitty school"
    },
    {
        "schoolId": "cc8e4afe-1b75-4f15-8f6d-77a821d91d4b",
        "schoolName": "JSS school"
    },
    {
        "schoolId": "cd27ecf8-99af-43c0-8f96-d7ddfc5b76fe",
        "schoolName": "NABATRITHA SCHOOL"
    },
    {
        "schoolId": "cd38b4b8-38b8-4149-a67b-d71bab2dde5e",
        "schoolName": "Lok Kalyaan School"
    },
    {
        "schoolId": "cd807ac9-d74d-4a30-9442-89ed07979a2d",
        "schoolName": "St Stephen'S School"
    },
    {
        "schoolId": "cdc6d7cc-e769-4b13-9031-294994d75ff9",
        "schoolName": "Ujwala Canvent"
    },
    {
        "schoolId": "cdcffb9c-8617-4de7-bcfc-94726f0986a1",
        "schoolName": "Krishna Gyan Niketan"
    },
    {
        "schoolId": "cdeb7424-9355-4f20-8340-87c16e09bbdc",
        "schoolName": "HRISHIKESH VIDYAPEETA"
    },
    {
        "schoolId": "ce9f40b0-a64b-4ca0-9762-6e7e2d2cd838",
        "schoolName": "SOPHAI SCHOOL"
    },
    {
        "schoolId": "cecdc9cc-626f-4952-b5bf-10e359e1b697",
        "schoolName": "S.B.I.O.A (CBSE) school- Thiruchirappalli"
    },
    {
        "schoolId": "cedc61a2-a787-11e8-98d0-529269fb1459",
        "schoolName": "Rajashree Memorial Public school"
    },
    {
        "schoolId": "cee30fc2-aa08-4c7d-8be7-7cbf46e38e18",
        "schoolName": "Apex Eng Med School"
    },
    {
        "schoolId": "ceec20e6-1a0c-4dc3-85c2-0c163b09d9c8",
        "schoolName": "R.P Children Jr. Hig School"
    },
    {
        "schoolId": "cf50f286-8161-434f-91fd-93a58e92478b",
        "schoolName": "SPECTRA SCHOOL"
    },
    {
        "schoolId": "cf6e9759-b00a-49bf-9f49-e3c9efb9007b",
        "schoolName": "Jesus Mary School"
    },
    {
        "schoolId": "f33a288e-a7b1-11e8-98d0-529269fb1459",
        "schoolName": "P.P.T.M.Y"
    },
    {
        "schoolId": "d010c661-c379-4ac7-81a0-003e4fcb91f6",
        "schoolName": "Modi Public School"
    },
    {
        "schoolId": "d0ebb7b8-51f0-494b-93ad-a837e69a9ac7",
        "schoolName": "VIMALA HRIDAYA ENGLISH SCHOOL"
    },
    {
        "schoolId": "d10d8935-13ac-4c19-a63b-681949f9f654",
        "schoolName": "Success n success school"
    },
    {
        "schoolId": "d1253aa4-5558-4484-89d5-2e035362f571",
        "schoolName": "Sri Krish International School (CBSE) - Chennai-gunduvancherry"
    },
    {
        "schoolId": "d19940d8-902b-480b-b200-80836423f13c",
        "schoolName": "GANDHI MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "d22275fe-2a13-43ca-bb98-3527a4343128",
        "schoolName": "Indo English School"
    },
    {
        "schoolId": "d2630fcb-b882-4c76-96c5-f6cf359d8539",
        "schoolName": "NVKS VIDYALAYA"
    },
    {
        "schoolId": "d28d6ac3-ac92-49a5-9632-9ab1ff618a37",
        "schoolName": "Sree Saraswathy Vidyanikethan"
    },
    {
        "schoolId": "d2958f72-8425-4437-aa02-722489b43f8d",
        "schoolName": "Coast Guard Kinder Garden School-Mogappair"
    },
    {
        "schoolId": "d2e31df2-4e3f-4ae8-b3e0-ee6e0476b355",
        "schoolName": "Gowthami Concept School"
    },
    {
        "schoolId": "d3032327-e0ff-4703-a986-3c80f584d23e",
        "schoolName": "CSI PUBLIC SCHOOL"
    },
    {
        "schoolId": "d303275e-cc62-423a-a71e-bd5e45a4482c",
        "schoolName": "K H M ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "d32a05f1-ad4a-4c3c-bff9-15e41704718a",
        "schoolName": "Murshidabad Public School"
    },
    {
        "schoolId": "d35efcbc-64a0-4b10-a1c6-5d36a6eebe11",
        "schoolName": "Vasavi International CBSE"
    },
    {
        "schoolId": "d367378e-1bd2-4103-a7f6-741039242d17",
        "schoolName": "Berhampore Donbosco"
    },
    {
        "schoolId": "d37138b3-0db1-4f68-a06f-20b3418e2012",
        "schoolName": "Ratnakar North Point School"
    },
    {
        "schoolId": "d3ebc282-f81b-4517-b40c-c09330654780",
        "schoolName": "S T.Peter'S School - Shangumugam"
    },
    {
        "schoolId": "d3ef1618-b08d-4e42-a53e-f2de547def54",
        "schoolName": "SUBBIAH CENTRAL SCHOOL"
    },
    {
        "schoolId": "d55c0bd0-b875-4a1c-8cb4-19950f0a8df3",
        "schoolName": "Holy Innocents High School- Nilgiris"
    },
    {
        "schoolId": "d587815a-3131-400f-8e7e-cf14ae14e083",
        "schoolName": "Bethany Central School - Alappuzha"
    },
    {
        "schoolId": "d58a82f4-ab8e-43c6-8cc8-6045d04de50d",
        "schoolName": "CAMBRIDGE CBSE SCHOOL"
    },
    {
        "schoolId": "d58e4036-f6d4-4870-85b5-ed7ef91e7a92",
        "schoolName": "ST PETERS HIGH SCHOOL"
    },
    {
        "schoolId": "d59323c9-627a-448e-aa87-78027be28548",
        "schoolName": "Study Point Jr High School"
    },
    {
        "schoolId": "d59a396c-94c4-47b1-a3d1-1424d1a8ead1",
        "schoolName": "Little Flower School-Basil Nagar"
    },
    {
        "schoolId": "d5cf7603-9b59-4087-9cea-7b34844e11c1",
        "schoolName": "Nagini Vidhyalaya Matric -HR-Sec. School Sudapalayam"
    },
    {
        "schoolId": "d5deaf0c-0bc8-4e76-9ade-3e4466e0775f",
        "schoolName": "SAL SABEEL PUBLIC SCHOOL"
    },
    {
        "schoolId": "d5e6743a-1b2b-4d82-be9b-e368bc277223",
        "schoolName": "Dust To Crown Public School"
    },
    {
        "schoolId": "d5e9bf4d-f6af-4a6a-8366-55f60e62487d",
        "schoolName": "FLOWRET ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "d664ad2b-f466-4110-9b0c-beb416a0c6b8",
        "schoolName": "NANDHINI SCHOOL"
    },
    {
        "schoolId": "d6737dee-1bbd-4647-b516-c5e7b1f55983",
        "schoolName": "FUSCOS HIGH SCHOOL"
    },
    {
        "schoolId": "d67d0c4a-c73f-40b3-aeb8-2fb6ab8c4bca",
        "schoolName": "Vertex School"
    },
    {
        "schoolId": "d67fa94d-d2d7-47a4-ae58-c2183b39cb42",
        "schoolName": "SERVITE MATRIC SCHOOL"
    },
    {
        "schoolId": "d75de2a3-a54d-4b83-9ecd-6164abb19944",
        "schoolName": "New carmel school"
    },
    {
        "schoolId": "d7869461-e2ed-4252-8e3b-37d4ec9a9fd0",
        "schoolName": "Mother Academy School"
    },
    {
        "schoolId": "d7a968ec-530b-4b5d-b5c4-d0f2d80ef225",
        "schoolName": "ST:MEERAS PUBLIC SCHOOL"
    },
    {
        "schoolId": "d7ad85a1-e040-4a16-8271-d4bee59e5a19",
        "schoolName": "Sri Lakshmi Vidhyalaya Matric.Hr.Sec.School"
    },
    {
        "schoolId": "d7c1d22a-c384-493b-9cea-ead2d12b1253",
        "schoolName": "Monigram Donbosco"
    },
    {
        "schoolId": "d884dc18-31ac-4d81-a4a7-e0b8a71bb612",
        "schoolName": "DAFFODILS HIGH SCHOOL"
    },
    {
        "schoolId": "d8c746c8-c2f6-4bb3-9964-b8ab5c2b4e66",
        "schoolName": "Thunchathacharya Vidyalayam"
    },
    {
        "schoolId": "d9e58b73-d75e-4241-8ab0-1813ec5ad227",
        "schoolName": "St. Johns School - Porur"
    },
    {
        "schoolId": "d9e962f1-a4c0-4ab6-a0e1-13d02420e137",
        "schoolName": "MONDISORRY N/P SCHOOL"
    },
    {
        "schoolId": "da0090f1-a95f-4cdf-a4fe-d6d03b14dd1d",
        "schoolName": "X.L.N.C E.M SCHOOL"
    },
    {
        "schoolId": "da73aed9-45a2-4cac-9f77-815390a1b91b",
        "schoolName": "NAJATH PUBLIC SCHOOL"
    },
    {
        "schoolId": "da83a24b-3d06-4d1b-aec5-c7fd81c05ffe",
        "schoolName": "VIMALA HIRADHYA ICSE SCHOOL- KOLLAN"
    },
    {
        "schoolId": "da8fd5ef-55d0-433a-b369-4c1928017730",
        "schoolName": "Panisheola Indira Smriti Vidyapith"
    },
    {
        "schoolId": "daa9ecf5-349c-4bd0-ba1c-a72a605c3bf6",
        "schoolName": "SRI VANI INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "daca8d8e-22d2-41bc-8435-13101fc8e325",
        "schoolName": "Vani Knachipuram"
    },
    {
        "schoolId": "db01ae62-fa6a-4ec1-8576-6c431188079f",
        "schoolName": "SSV Matric Hr. Sec. School-Melur"
    },
    {
        "schoolId": "db04dcd9-c342-40c0-8e4c-fd3c344ee928",
        "schoolName": "LITTLE STAR SCHOOL"
    },
    {
        "schoolId": "db1bc584-21b5-4dab-9129-a78fa31a4f33",
        "schoolName": "CENTRAL MODEL SCHOOL"
    },
    {
        "schoolId": "db520e04-1165-490c-819c-a3124b102670",
        "schoolName": "NSP VIDYAPETTAM CBSE SCHOOL"
    },
    {
        "schoolId": "db6428be-5530-4a48-ae5e-e804a47c9296",
        "schoolName": "Prema Seva Mandir"
    },
    {
        "schoolId": "dbbcf6a0-de5c-425f-86e3-9b03388b1215",
        "schoolName": "sishya intl school"
    },
    {
        "schoolId": "dbcdb07c-a975-453a-9999-91f5c3512e62",
        "schoolName": "Vaima Kids-Rajapalayam"
    },
    {
        "schoolId": "dbed8164-1431-478c-84e3-dd8d7019f85f",
        "schoolName": "MONFORT SCHOOL"
    },
    {
        "schoolId": "dbf97e6c-455f-4c9e-adba-da13e9d1bc86",
        "schoolName": "Velammal Mat.Hr.Sec.School-Madhavaram"
    },
    {
        "schoolId": "dc5ad956-6817-44f2-b81b-cd3ce596685d",
        "schoolName": "ST. ANNS ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "dc6e9cbf-081c-4f5a-8594-1ce47cbe89cd",
        "schoolName": "Canossa School"
    },
    {
        "schoolId": "dca0cf7c-d483-4781-8719-01f9dc8180a5",
        "schoolName": "MOUNT CARMEL ICSE"
    },
    {
        "schoolId": "dd227228-8bf7-4d17-aa5e-48d265cb22e6",
        "schoolName": "Faith Centre Academy-Trivandrum"
    },
    {
        "schoolId": "dd26c34f-fd85-42aa-8691-073590175c59",
        "schoolName": "Vishwaksena Vidya Vikas Matric Hr. Sec. School"
    },
    {
        "schoolId": "dd30c591-753d-4677-a0ca-d4cc3ace5f2b",
        "schoolName": "Deepthi"
    },
    {
        "schoolId": "dda8fada-0643-4197-bd70-a43465058026",
        "schoolName": "NRM Dream School - Tirumangalam"
    },
    {
        "schoolId": "dde62e76-186a-4496-9730-0a145b09d4ce",
        "schoolName": "St.Xavier Group"
    },
    {
        "schoolId": "ddf408ac-9ace-48d7-9611-6f4b591d98c6",
        "schoolName": "SUREKA INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "de351391-5a86-4630-a1b0-5190d9b70963",
        "schoolName": "CS ACADEMY SCHOOL"
    },
    {
        "schoolId": "e0067628-b9e2-4b74-b71b-93e9738405f3",
        "schoolName": "St Mariam School"
    },
    {
        "schoolId": "e06ae331-0ea3-4c8e-999c-f52faec03df2",
        "schoolName": "Trinity Garden Public School"
    },
    {
        "schoolId": "e0a52109-adfd-4aa8-8540-65fdd4a29384",
        "schoolName": "Nearj Memorial"
    },
    {
        "schoolId": "e0a7bd39-0f9c-451b-8406-ca85e69fa7ae",
        "schoolName": "BRIGHT ACADEMY"
    },
    {
        "schoolId": "e0cbb22d-0d0e-4027-aa6a-78678eb26a00",
        "schoolName": "SREE SANKARA VIDYA PEETAM"
    },
    {
        "schoolId": "e0f07f3d-8523-405f-882f-2112f1f87d11",
        "schoolName": "GNANYODHYA INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "e15cac9f-9069-4d67-89c2-dcbf9414bf63",
        "schoolName": "Academic Heights Public School"
    },
    {
        "schoolId": "e1d76a25-b3d3-4e4f-9987-854a8c800b8a",
        "schoolName": "Kamala Subramaniam Matric. Hr.Sec.School"
    },
    {
        "schoolId": "e1de9990-8e01-40bb-a060-12a9787d9bf9",
        "schoolName": "Holytrinity Anglo Indian School - Karunagapally"
    },
    {
        "schoolId": "e212bbff-58b3-4e7a-a067-50757cdb518b",
        "schoolName": "JAIN INTERNATIONAL SCHOOL"
    },
    {
        "schoolId": "e2449aeb-9c3b-442a-bd1c-a63fbb2700c5",
        "schoolName": "Red rose school"
    },
    {
        "schoolId": "e2d3126a-ce2c-4c7a-8574-c744e9d208ee",
        "schoolName": "START RIGHT ENGLISH SCHOOL"
    },
    {
        "schoolId": "e3178be1-1418-4e83-88a6-3cab6b0a030d",
        "schoolName": "Jagriti Public School"
    },
    {
        "schoolId": "e39f5cab-961b-4629-bb8a-78f131a9e43b",
        "schoolName": "ST.JOSEPH ICSE"
    },
    {
        "schoolId": "e3d05e7d-0a45-4cb2-8639-defca8c7ca7d",
        "schoolName": "KNOWLEDGE PARK SCHOOL"
    },
    {
        "schoolId": "e3fa22ce-1240-4705-a537-746437de9907",
        "schoolName": "Little Angel School"
    },
    {
        "schoolId": "e42296b2-3e2b-4587-9c2d-3b57d81fcde7",
        "schoolName": "ALMIGHTY JESUS PUBLIC SCHOOL"
    },
    {
        "schoolId": "e47f1034-32eb-4e70-ab73-c492e21b9e36",
        "schoolName": "Woodbine Modern Academy"
    },
    {
        "schoolId": "e4af79a3-264c-4de8-a33e-3f3f8e5d5ab3",
        "schoolName": "CONCORD PUBLIC SCHOOL"
    },
    {
        "schoolId": "e4f33569-9a06-442f-bea8-7caa15aa940b",
        "schoolName": "GHOSH MEMORIAL SCHOOL"
    },
    {
        "schoolId": "e500ce0e-f1af-4296-82c3-2b17bf430bb6",
        "schoolName": "GOLDEN SPARK MHS SCHOOL"
    },
    {
        "schoolId": "e505c2b4-e7c9-433b-a69c-adf9855ae3e2",
        "schoolName": "S.B.O.A. (CBSE) School- Madurai"
    },
    {
        "schoolId": "e579faf5-e0e8-432e-9417-7cffb91f26e3",
        "schoolName": "Savio English School - Kozhencherry"
    },
    {
        "schoolId": "e59813c3-4790-453d-bd18-5888c0e03e42",
        "schoolName": "JAYARAJESH SCHOOL"
    },
    {
        "schoolId": "e59ee54c-fcf5-4d64-be77-7da695dfb7ed",
        "schoolName": "SLV BOOKS"
    },
    {
        "schoolId": "e61f3286-74bb-4a77-a4d6-7b7a82f8c44a",
        "schoolName": "ST PHILLOMINAS SCHOOL"
    },
    {
        "schoolId": "e61fe531-91b5-4d10-b35f-86fd108bda89",
        "schoolName": "Rosary Matric.Hr.Sec.School"
    },
    {
        "schoolId": "e65e4e87-c0da-44f8-bb8b-0fbb4ca89a83",
        "schoolName": "Vasu English Medium School"
    },
    {
        "schoolId": "e7a28059-be29-48e5-91ca-5bf78bb0775a",
        "schoolName": "Velammal Mat.Hr.Sec.School-Thiruppuvanam"
    },
    {
        "schoolId": "e7a2ee9c-5f3d-4d0d-bdce-7a8980ed1e3b",
        "schoolName": "Jaya Jaya Shankara"
    },
    {
        "schoolId": "e7d0d478-8d02-41eb-826e-7060ecbf53e2",
        "schoolName": "Bright's Higher Secondary School"
    },
    {
        "schoolId": "e81b6ee9-7a88-4868-ab2c-1dd5ef6c9bfb",
        "schoolName": "Good Shephered English Med. School-Pathanamthitta"
    },
    {
        "schoolId": "e8acdbdd-f8ac-4a43-bc8c-8e935a018952",
        "schoolName": "Jawahar Bharath School"
    },
    {
        "schoolId": "e8b39486-14b5-4365-b960-d11666a5d7df",
        "schoolName": "Sanskrit Public School"
    },
    {
        "schoolId": "e8c09bb9-5436-47e9-8292-c8b37d617a2d",
        "schoolName": "Sai Ram School - Kukatpally"
    },
    {
        "schoolId": "e9090357-7716-424a-a148-cfe765916e19",
        "schoolName": "Bala Bharathi School"
    },
    {
        "schoolId": "e90c6810-67cf-4dad-9adc-c591ca9ad760",
        "schoolName": "Sri Ayyan Vidyasram School"
    },
    {
        "schoolId": "e92c2324-ebe3-41c7-a1de-1b081664a979",
        "schoolName": "SSS MATRIC SCHOOL"
    },
    {
        "schoolId": "e96536ae-47db-4b21-9828-869b4127f1d5",
        "schoolName": "Monastic Public School"
    },
    {
        "schoolId": "e96826b8-1fda-4eaf-9d2a-7c72dac7752e",
        "schoolName": "Daffodils Public School"
    },
    {
        "schoolId": "e99ab786-6ff9-4a92-91bd-07925ac8b28c",
        "schoolName": "VANI SCHOOL"
    },
    {
        "schoolId": "e9d2d44c-98e2-4c14-89d2-e86c11c9856e",
        "schoolName": "VINS CBSE SCHOOL"
    },
    {
        "schoolId": "e9fbe0ad-d824-4293-9ecb-780376bca7e0",
        "schoolName": "SHIFFON NOOR GLOBAL SCHOOL"
    },
    {
        "schoolId": "e9fc6e5d-d543-49eb-9d4c-e6f99ca3020d",
        "schoolName": "vivekanada academy"
    },
    {
        "schoolId": "ea0e25ba-df5e-4cc5-8fb9-8a8ffd89be13",
        "schoolName": "Ved International School"
    },
    {
        "schoolId": "ea2ecffd-db47-44e3-831b-78e963208f69",
        "schoolName": "Presedancy School"
    },
    {
        "schoolId": "ea6d0d63-867e-4a6b-b9c3-82ca72550445",
        "schoolName": "ST ALOYSIOUS CONVENT SCHOOL"
    },
    {
        "schoolId": "ea90305a-c48a-4c8d-87bd-6c2d733423b5",
        "schoolName": "ChammUdeswari School - Karikakum"
    },
    {
        "schoolId": "ead921fa-1c4d-4080-b855-6e6dbd947028",
        "schoolName": "Let Matadeen School"
    },
    {
        "schoolId": "eaff2fd7-5fd3-4525-9629-18a81a3c6cb4",
        "schoolName": "Rose Public School"
    },
    {
        "schoolId": "eb0d995b-70c0-448e-9b69-2ff47542bed0",
        "schoolName": "Kashyap school"
    },
    {
        "schoolId": "eb4ed39f-cf03-4001-b44f-0f2619a3e5aa",
        "schoolName": "st alphonsa hg school"
    },
    {
        "schoolId": "eb566936-76e0-4a29-ba47-8bc6aa1ed3c7",
        "schoolName": "Moden School Infrant"
    },
    {
        "schoolId": "eb6ffdd1-da39-4f2f-9a92-88c35ef3d221",
        "schoolName": "Columbia Foundation School"
    },
    {
        "schoolId": "eb9823c4-4bc7-422b-a4f2-b76f15fa391e",
        "schoolName": "Kalaimagal Vidyalaya Matric Hr Sec School - Royapuram"
    },
    {
        "schoolId": "ebb28743-a8f8-4381-b2d9-fd43c0dc37da",
        "schoolName": "Kids Garden School"
    },
    {
        "schoolId": "ebb8a5a8-c108-475d-b98e-edd595e50749",
        "schoolName": "Vaishnavi Group Schools"
    },
    {
        "schoolId": "ebba5082-a551-11e8-b03b-529269fb1459",
        "schoolName": "AL FALAH"
    },
    {
        "schoolId": "ebba549c-a551-11e8-b03b-529269fb1459",
        "schoolName": "AL HUDA EMS"
    },
    {
        "schoolId": "ebba5758-a551-11e8-b03b-529269fb1459",
        "schoolName": "Al Maquar Public School"
    },
    {
        "schoolId": "ebba5c6c-a551-11e8-b03b-529269fb1459",
        "schoolName": "Al Maquar Public School"
    },
    {
        "schoolId": "ebba5f50-a551-11e8-b03b-529269fb1459",
        "schoolName": "ALIF ISLAMIC"
    },
    {
        "schoolId": "ebba61bc-a551-11e8-b03b-529269fb1459",
        "schoolName": "Bharatiya Vidyabhavan"
    },
    {
        "schoolId": "ebba6400-a551-11e8-b03b-529269fb1459",
        "schoolName": "BHAVANS"
    },
    {
        "schoolId": "ebba6658-a551-11e8-b03b-529269fb1459",
        "schoolName": "Chinmaya Vidyalaya"
    },
    {
        "schoolId": "ebba68c4-a551-11e8-b03b-529269fb1459",
        "schoolName": "DARUL FALAH ENGLISH SCHOOL"
    },
    {
        "schoolId": "ebba6d92-a551-11e8-b03b-529269fb1459",
        "schoolName": "DOWN PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebba6ffe-a551-11e8-b03b-529269fb1459",
        "schoolName": "GARDEN VALLEY"
    },
    {
        "schoolId": "ebba7274-a551-11e8-b03b-529269fb1459",
        "schoolName": "HIDAYA EMS"
    },
    {
        "schoolId": "ebba74e0-a551-11e8-b03b-529269fb1459",
        "schoolName": "HIDAYA PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebba776a-a551-11e8-b03b-529269fb1459",
        "schoolName": "IQURA ENGLISH SCHOOL"
    },
    {
        "schoolId": "ebba7c2e-a551-11e8-b03b-529269fb1459",
        "schoolName": "ISD Public School"
    },
    {
        "schoolId": "ebba7ecc-a551-11e8-b03b-529269fb1459",
        "schoolName": "Khuthubiya English Medium School"
    },
    {
        "schoolId": "ebba8142-a551-11e8-b03b-529269fb1459",
        "schoolName": "KPM EMS"
    },
    {
        "schoolId": "ebba83c2-a551-11e8-b03b-529269fb1459",
        "schoolName": "MAHALARA EMS"
    },
    {
        "schoolId": "ebba86a6-a551-11e8-b03b-529269fb1459",
        "schoolName": "MAHALARA PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebba8b4c-a551-11e8-b03b-529269fb1459",
        "schoolName": "Manohara Nursery & Primary School"
    },
    {
        "schoolId": "ebba8dc2-a551-11e8-b03b-529269fb1459",
        "schoolName": "Mariabhawan"
    },
    {
        "schoolId": "ebba902e-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARIAM NIVAS HIGHER"
    },
    {
        "schoolId": "ebba9268-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ"
    },
    {
        "schoolId": "ebba94de-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ EMS"
    },
    {
        "schoolId": "ebba9952-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ EMS"
    },
    {
        "schoolId": "ebba9bdc-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebba9e3e-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebbaa08c-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ PUBLIC SCHOOL"
    },
    {
        "schoolId": "ebbaa2e4-a551-11e8-b03b-529269fb1459",
        "schoolName": "MARKEZ SCHOOL"
    },
    {
        "schoolId": "ebbaa79e-a551-11e8-b03b-529269fb1459",
        "schoolName": "MEMS"
    },
    {
        "schoolId": "ebbaaa00-a551-11e8-b03b-529269fb1459",
        "schoolName": "Mubaraq"
    },
    {
        "schoolId": "ebbaac62-a551-11e8-b03b-529269fb1459",
        "schoolName": "National Kids Play School"
    },
    {
        "schoolId": "ebbaaf14-a551-11e8-b03b-529269fb1459",
        "schoolName": "NATIONAL PUBLIC SCHOOL- THAZHUTHALA-KOLLAM"
    },
    {
        "schoolId": "ebbab16c-a551-11e8-b03b-529269fb1459",
        "schoolName": "NIBRASS"
    },
    {
        "schoolId": "ebbab590-a551-11e8-b03b-529269fb1459",
        "schoolName": "NUSRATH SCHOOL"
    },
    {
        "schoolId": "ebbab7fc-a551-11e8-b03b-529269fb1459",
        "schoolName": "ROSE DALE SCHOOL"
    },
    {
        "schoolId": "ebbabbc6-a551-11e8-b03b-529269fb1459",
        "schoolName": "SACRED HEART SR SEC"
    },
    {
        "schoolId": "ebbabdf6-a551-11e8-b03b-529269fb1459",
        "schoolName": "SN Vidyamandir"
    },
    {
        "schoolId": "ebbabfea-a551-11e8-b03b-529269fb1459",
        "schoolName": "St. Joseph"
    },
    {
        "schoolId": "ebbac36e-a551-11e8-b03b-529269fb1459",
        "schoolName": "ST.CHARLES BORROEO CONVENT"
    },
    {
        "schoolId": "ebbac558-a551-11e8-b03b-529269fb1459",
        "schoolName": "ST.CHARLES BORROEO CONVENT"
    },
    {
        "schoolId": "ebbac72e-a551-11e8-b03b-529269fb1459",
        "schoolName": "Urusiline Senior Secondary School"
    },
    {
        "schoolId": "ebbac90e-a551-11e8-b03b-529269fb1459",
        "schoolName": "YAMMANIYA"
    },
    {
        "schoolId": "ebf8d074-2d7e-4ebf-b047-9913c708b864",
        "schoolName": "Jm Sr/Jr Secondary School"
    },
    {
        "schoolId": "ed16625d-df10-420b-8882-96794f2f14a4",
        "schoolName": "Velammal Mat.Hr.Sec.School-Theni"
    },
    {
        "schoolId": "ed662963-de04-405b-9472-f0e889e431e7",
        "schoolName": "Y.K.Achari School"
    },
    {
        "schoolId": "ed722059-de7c-44c4-9d39-36134ecd6b68",
        "schoolName": "Sri Krish International School (CBSE) - Chennai KOVUR"
    },
    {
        "schoolId": "ed7d9004-350b-4d3d-a9a0-2332c3abd910",
        "schoolName": "BALAKRISHNA MATRI SCHOOL"
    },
    {
        "schoolId": "ed8b5d17-32d6-4d1d-b4cd-d84c767d4925",
        "schoolName": "St Thomas Topsia"
    },
    {
        "schoolId": "ed95c499-936a-489c-b76d-56df73ad505f",
        "schoolName": "Sunrise School"
    },
    {
        "schoolId": "f33a25dc-a7b1-11e8-98d0-529269fb1459",
        "schoolName": "GUIDANCE PUBLIC SCHOOL"
    },
    {
        "schoolId": "edbffe5f-c01e-44b9-9bfe-02cbbc3cc8df",
        "schoolName": "Dr. G.R Public School"
    },
    {
        "schoolId": "ee0e1606-f75a-4d35-ab5b-894eecb19467",
        "schoolName": "GURUMUKI VIDYASHRAM"
    },
    {
        "schoolId": "ee187432-dba4-4b0a-8fef-6152cfb70865",
        "schoolName": "Outreach School"
    },
    {
        "schoolId": "ee222e09-eb95-4255-bb13-7cf741cb1231",
        "schoolName": "M.K. Letha School - Konni"
    },
    {
        "schoolId": "ee266623-c002-43ab-9911-268284de0c1e",
        "schoolName": "Rks Tutorial"
    },
    {
        "schoolId": "ee80979d-ecbe-4f74-89ba-29bde03bc32c",
        "schoolName": "St. Fidelis College"
    },
    {
        "schoolId": "eeb6b56a-991f-4fc0-b38b-c58723f51f9d",
        "schoolName": "Springdales School"
    },
    {
        "schoolId": "eecb29b1-4690-4fdf-be45-21aad0d78451",
        "schoolName": "VASANTH VALLY SCHOOL"
    },
    {
        "schoolId": "ef0c6d21-3dc8-4f1e-a972-d1d948f01c64",
        "schoolName": "WISDOM SCHOOL"
    },
    {
        "schoolId": "ef5e24c1-bcf3-4ebf-961f-8259b2d1b84b",
        "schoolName": "Indira Gandhi Public School"
    },
    {
        "schoolId": "ef8927f3-c221-482f-beaa-cdcf5a49a525",
        "schoolName": "A.J.I Public School"
    },
    {
        "schoolId": "effb2cfe-137b-469a-bc34-7e0f6952cf3f",
        "schoolName": "St. Mars"
    },
    {
        "schoolId": "f04c75c9-8924-406b-b59c-f45c8f08f393",
        "schoolName": "Padmavathi Vidhyalaya"
    },
    {
        "schoolId": "f1159361-70df-4f54-9002-975d777d44c0",
        "schoolName": "Arunodaya school"
    },
    {
        "schoolId": "f11a10ca-785b-47cf-9538-ba99c2c16902",
        "schoolName": "GODWIN SCHOOL"
    },
    {
        "schoolId": "f1803fcf-cc32-4874-b60a-5781225c8ed1",
        "schoolName": "St. Joseph School - Coonur"
    },
    {
        "schoolId": "f1853f7d-4075-4bcc-9d37-03feffb38c44",
        "schoolName": "GOOD LUCK MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "f1b4e6d7-4f38-470c-83cc-ea4cea103673",
        "schoolName": "SSV Matric School- Melur (N & P) - Gram Companion"
    },
    {
        "schoolId": "f1eb7833-eb4d-4adc-88b9-9cc004b8250e",
        "schoolName": "Sarswati Sadan School"
    },
    {
        "schoolId": "f1f2f36d-e8bb-4140-91b8-2445cd75d2e4",
        "schoolName": "ST. THERESA BACQ PUBLIC SCHOOL"
    },
    {
        "schoolId": "f20a322b-fd39-44cb-8690-c336bc5719c4",
        "schoolName": "Nalanda School"
    },
    {
        "schoolId": "f25b0f9c-de49-45b9-8bf6-20c5f0f628a0",
        "schoolName": "Standard Higher Primary School"
    },
    {
        "schoolId": "f2a6c598-a780-11e8-98d0-529269fb1459",
        "schoolName": "CHALAPPURAM"
    },
    {
        "schoolId": "f2a6c8fe-a780-11e8-98d0-529269fb1459",
        "schoolName": "CHAVAYOOUR"
    },
    {
        "schoolId": "f2bdc53d-1e3d-4cea-b2b1-3c411e9fb62d",
        "schoolName": "Memari Cristal Model School"
    },
    {
        "schoolId": "f2ca2740-0e01-4702-a0dc-41fb2c7257a9",
        "schoolName": "Mount Carmel CMI Central School - Enathu"
    },
    {
        "schoolId": "f319ff27-4e85-43ec-9575-28b12e0b0074",
        "schoolName": "HILLTOP MARAVANCHERY(GRAMMER)"
    },
    {
        "schoolId": "f3228854-d814-4e34-9b5f-648ce8616d3a",
        "schoolName": "BES ENGLISH MEDIUM SCHOOL"
    },
    {
        "schoolId": "f3347910-f552-422f-82e1-a0f0655a12ae",
        "schoolName": "SRI JANNAI MHS SCHOOL"
    },
    {
        "schoolId": "f33dfbca-f35b-47e1-8a8e-040c451505f3",
        "schoolName": "Gyan Bharti School"
    },
    {
        "schoolId": "f42cc33a-66bc-4721-a764-2b05cfa40a21",
        "schoolName": "KRM Perambur School"
    },
    {
        "schoolId": "f43b3335-f78d-471b-9648-47e4902f175a",
        "schoolName": "CSR Matric School-Madurai"
    },
    {
        "schoolId": "f4c5da36-fdf7-4ebc-9619-9c925dd236c7",
        "schoolName": "Bethsada Public School - Vengola"
    },
    {
        "schoolId": "f4c9fedb-0103-42eb-b206-dc5eed82a746",
        "schoolName": "Sri Sankara Vidyalaya Nur & Pri School"
    },
    {
        "schoolId": "f4cc9f3b-577f-45e2-b76f-87560d4de304",
        "schoolName": "BALAJI TECHNO HIGH SCHOOL"
    },
    {
        "schoolId": "f5631ef6-630e-440e-be07-8c96b70b9a46",
        "schoolName": "Sainik Public School"
    },
    {
        "schoolId": "f56ac9e9-b5d1-499a-ac66-5fc8522abb6d",
        "schoolName": "Ramakrishna Matric Hr. Sec. School-Madurai - Grammar"
    },
    {
        "schoolId": "f5efdade-e1e6-4afc-93a9-b88b24391a57",
        "schoolName": "Upsana Academy"
    },
    {
        "schoolId": "f5f5cae4-dc2e-4dc1-8c00-e0fd88861eb6",
        "schoolName": "CARMEL MATHA MATRIC"
    },
    {
        "schoolId": "f62529f5-2551-4e07-93c1-9e562d5a691d",
        "schoolName": "ST.MERRY RANAGHAT"
    },
    {
        "schoolId": "f63b5d63-cfc4-45d1-bd46-6c50270571e4",
        "schoolName": "Sri Sankara Matriculation Hr. Sec. School"
    },
    {
        "schoolId": "f6b63ffe-5f17-4603-bb21-11465c7ed767",
        "schoolName": "Shree Punyakoti Vidya Samasthe School"
    },
    {
        "schoolId": "f6ef6435-79ff-4fe4-abdd-c4b1759414d0",
        "schoolName": "SRV HI TECH MATRIC SCHOOL"
    },
    {
        "schoolId": "f7665ebc-284b-43cc-ab50-f87f81f2ded3",
        "schoolName": "Happy Days Public School"
    },
    {
        "schoolId": "f76e807f-1458-42d3-8619-264c663b7347",
        "schoolName": "SADGURU VIDYALAYAM"
    },
    {
        "schoolId": "f772f07c-3d00-4c95-a3c5-a6a8dc7e57e6",
        "schoolName": "GURU VIDYALAYA MHS SCHOOL"
    },
    {
        "schoolId": "f779f423-f567-413d-b6c8-ae500a6f97e0",
        "schoolName": "THE NEW JOHN DEWEY MAT SCHOOL"
    },
    {
        "schoolId": "f7c2fc6f-4448-430e-b3ef-ee851341316d",
        "schoolName": "DR.SRK CBSE SCHOOL"
    },
    {
        "schoolId": "f877d7e6-188d-44a5-9b20-7a5b4366a0ef",
        "schoolName": "Morden School Loyabade"
    },
    {
        "schoolId": "f8ca196c-befe-4d58-9d24-40cc99014a40",
        "schoolName": "Saravana Vidyamandir Matric. Hr.Sec. School-Madurai"
    },
    {
        "schoolId": "f954280c-0eaf-4075-a639-b950a22af480",
        "schoolName": "KERALA HIGH SCHOOL"
    },
    {
        "schoolId": "f96a356b-5a8e-4b29-a8f1-73db513d1582",
        "schoolName": "St Anthony"
    },
    {
        "schoolId": "f981b3bb-412a-41c6-be2a-df909aaf0236",
        "schoolName": "Crescent English Medium School"
    },
    {
        "schoolId": "f9e4e17b-568d-4320-bf67-78b33926f051",
        "schoolName": "Our Lady Maticulation Hr.Sec.School -Ponmeni - Grammar"
    },
    {
        "schoolId": "f9faf732-0091-4a44-ae9c-2a04eea185f9",
        "schoolName": "KALAIMAHAL MAT.HR.SEC.SCHOOL"
    },
    {
        "schoolId": "fa8c7668-0e2e-41fa-91c6-7be011c3b105",
        "schoolName": "DAFFODILS SCHOOL"
    },
    {
        "schoolId": "fa9a248e-3d98-4553-893f-3376b6bbf4a6",
        "schoolName": "MOUNT SINORIA SCHOOL"
    },
    {
        "schoolId": "fb40cd5c-b235-40c8-ba24-6fff03beec24",
        "schoolName": "KVS Matric. Hr.Sec. School- Virudhunagar"
    },
    {
        "schoolId": "fb43c68f-1e6b-41a6-8db2-c037b47cbe1b",
        "schoolName": "DAWN SHIKSALAYA CBSE SCHOOL"
    },
    {
        "schoolId": "fb5cca4a-291f-4d96-9be3-e5c51f4a723e",
        "schoolName": "Nazareth School"
    },
    {
        "schoolId": "fbc0e06b-5f05-4185-a33c-9dc9e3163fad",
        "schoolName": "Sanjos Metropolitan School"
    },
    {
        "schoolId": "fc178345-a44d-4ff0-859a-af07c84f7d0a",
        "schoolName": "Lourde Matha Public School (CBSE) - Meenkulam"
    },
    {
        "schoolId": "fc2f5473-4c09-41ef-a211-a028d00f9761",
        "schoolName": "Jaimatha Public School"
    },
    {
        "schoolId": "fc54c140-17b2-4a21-bb30-97ee5d4ff33c",
        "schoolName": "Gurukurpa kinderkarten school"
    },
    {
        "schoolId": "fc644513-d0da-4411-a528-256666bb1f33",
        "schoolName": "YETRACODE SCHOOL"
    },
    {
        "schoolId": "fcb5ed31-011d-4d83-8e32-ea556d85652b",
        "schoolName": "Placid Vidya Vihar Sr.Sec.School-Changanacherry"
    },
    {
        "schoolId": "fda7d5b3-124a-4bb3-86fe-d584c2544dfc",
        "schoolName": "CSI MH SCHOOL"
    },
    {
        "schoolId": "fe4f7897-b8d6-4e66-b85e-4c90546e4588",
        "schoolName": "De Sales School"
    },
    {
        "schoolId": "fe8d7b08-927e-4bf2-9717-debf6a37ae87",
        "schoolName": "SUCCESS HIGH SCHOOL"
    },
    {
        "schoolId": "fef51caa-7826-4618-8667-07606a59d21b",
        "schoolName": "Disha Pub. School"
    },
    {
        "schoolId": "ff215fbc-dc48-47cd-8dee-74384e05ad72",
        "schoolName": "BACHPAN SCHOOL"
    }
]

async.each(data, function (value, callback) {
    var school = "use nsa;insert into school_details (tenant_id, school_id, created_date, project_id, server_api_key,school_name, school_code, google_key, city,  contact_us, about_us, latitude, longitude, password, phone_number,street_address_1,logo, school_management) values(8eb846a0-4549-11e7-9543-276f818a8422, " + value.schoolId + ", toTimestamp(now()),'268489962138', 'AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi', '" + value.schoolName + "', 1022,'AIzaSyATzSGMR-2oUu6SjPDDtKksReYCLXxV2K8', 'West Bengal', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Begumbazar-600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in</br>http://www.nexrisetech.com</br>', '<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, completeschool management system. School management software opens a wide range of opportunities tosystematise the laborious paperwork and error prone manual inputs. With our proposed end to endconnectivity aided software, the management can more effectively interact with the teachers, parents and students as they develop skills and character for success.</br>', 13.100125, 80.170255, 'bodi123', {'primary':'044-65664488'},'PMR Towers,</br>Menambedu Main Road</br>Begumbazar-600098 </br>Ambattur Industrial Estate','nsa-schools/logo/NexSchoolAppLogo.png', false);"
    console.log("school", school)
    var sdata = "INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimeStamp(now()),'Admin','A','Section A',true,'Admin',toTimeStamp(now()),'Admin'); INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimeStamp(now()),'Admin','B','Section B',true,'Admin',toTimeStamp(now()),'Admin'); INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimeStamp(now()),'Admin','C','Section C',true,'Admin',toTimeStamp(now()),'Admin'); INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimeStamp(now()),'Admin','D','Section D',true,'Admin',toTimeStamp(now()),'Admin'); INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimeStamp(now()),'Admin','E','Section E',true,'Admin',toTimeStamp(now()),'Admin'); INSERT INTO nsa.school_sections (tenant_id,school_id,academic_year,section_id,created_by,created_date,created_firstname,section_code,section_name,status,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Admin',toTimeStamp(now()),'Admin','F','Section F',true,'Admin',toTimeStamp(now()),'Admin');"
    var smdata = "INSERT INTO nsa.school_media_usage_limit (id, tenant_id, school_id, media_id, available_limit, media_name, used_count) VALUES (82e315d7-95f2-4207-9747-21ada1143f9c, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 50000, 'sms', 0); INSERT INTO nsa.school_media_usage_limit (id, tenant_id, school_id, media_id, academic_year, available_limit, media_name, used_count) VALUES (82e315d7-95f2-4207-9747-21ada1143f9c, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 5, '2018-2019', 0, 'voice',0);"
    var acdata = "insert into nsa.academic_year(id , ac_year , start_date , tenant_id, school_id , end_date , created_date, terms,is_current_year) values (f00d6478-8063-47b4-b663-3b6fc431befb,'2018-2019','2017-06-01 00:00:00', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, '2018-05-01 00:00:00', toTimeStamp(now()), {e78ced2d-0034-4a4a-817c-ccf53a1bb56c: 'Term 1', af5327d0-484a-4ab9-ac19-aaef7c72c201: 'Term 2'},true);"
    var landata = "insert into school_languages(language_id, language_name, tenant_id, school_id) values (dd0163a0-cae0-48f4-92c4-9faf91a3d630, 'English', 8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df);"
    var sfdata = "insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (88d34e03-d9d0-431a-ae06-7a92ce2b4d3c,9876ac80-6410-440c-ad25-99d67be2c8fc, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Fee Creation- Notification','Dear parent, {fee_name} is to be paid on/before {due_date}. Kindly make the payment before due date.', 'Fee Creation- Notification', 'Dear parent, {fee_name} is to be paid on/before {due_date}. Kindly make the payment before due date.', 'Fee Creation- Notification', 'Dear parent, {fee_name} is to be paid on/before {due_date}. Kindly make the payment before Due date.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (970ba5c4-62e6-4027-9662-ab320eb9fbbc,3172122c-c09d-4b05-ad49-430aacb48a0d, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Assignment Created- Notification','%s : HW created for {subjects}: {title}. Due Date: {due_date}.', 'Assignment Created- Notification','{full_name} : HW created for {subjects} : {title}. Due Date: {due_date}', 'Assignment Created- Notification','{full_name} : HW created for {subjects} : {title}. Due Date: {due_date}', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (970ba5c4-62e6-4027-9662-ab320eb9fbbc,3172122c-c09d-4b05-ad49-430aacb48a0d, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Student', 'Assignment Updated- Notification','%s : HW - {subject_name} - {title} has been updated by {staff_name}. Kindly check the details for corrections.', 'Assignment Updated- Notification','{full_name} : HW - {subject_name} - {title} has been updated by {staff_name}. Kindly check the details for corrections.', 'Assignment Updated- Notification','{full_name} : HW - {subject_name} - {title} has been updated by {staff_name}. Kindly check the details for corrections.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (bb03c817-92c1-40bf-ad55-4ccee6944097,05997f8d-e71e-4314-846d-88f353f5013e, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Attendance Information- Notification','Dear Parent, Your child %s of {class} {section} is present for the day.', 'Attendance Information- Notification','Dear Parent, Your child {full_name} of {class} {section} is present for the day.', 'Attendance Information- Notification','Dear Parent, Your child {full_name} of {class} {section} is present for the day.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (bb03c817-92c1-40bf-ad55-4ccee6944097,05997f8d-e71e-4314-846d-88f353f5013e, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Student', 'Attendance Information- Notification','Dear Parent, Your child %s of {class} {section} is absent for the day.', 'Attendance Information- Notification','Dear Parent, Your child {full_name} of {class} {section} is absent for the day.', 'Attendance Information- Notification','Dear Parent, Your child {full_name} of {class} {section} is absent for the day.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (439b6d5b-c081-4077-b1f0-4875e9532c64,c0c8820e-07f9-4744-80df-e5a8fbca2f18, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Event Invitation- Notification','Event Invitation - Event Name: {event_name} | Date: {start_date} to {end_date} | Venue:  {venue_name}. Thank You.', 'Event Invitation- Notification','Event Invitation - Event Name: {event_name} | Date: {start_date} to {end_date} | Venue:  {venue_name}. Thank You.', 'Event Invitation- Notification','Event Invitation - Event Name: {event_name} | Date: {start_date} to {end_date} | Venue: {venue_name}.Thank You.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (439b6d5b-c081-4077-b1f0-4875e9532c64,c0c8820e-07f9-4744-80df-e5a8fbca2f18, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 3, 'Student', 'Event Invitation- Notification','{event_name} has been cancelled due to unavoidable reasons. Sorry for the inconvienence.', 'Event Invitation- Notification','{event_name} has been cancelled due to unavoidable reasons. Sorry for the inconvienence.', 'Event Invitation- Notification','{event_name} has been cancelled due to unavoidable reasons. Sorry for the inconvienence.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (b38102ac-34d6-4c03-aadb-32bccfd7daf7,82ccb585-6625-49dc-b978-6570f4a83b9e, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Holiday Creation- Notification','Dear Parent/Staff, on account of {holiday_name}, {start_date} - {end_date} will be a holiday.', 'Holiday Creation- Notification','Dear Parent/Staff, on account of {holiday_name}, {start_date} - {end_date} will be a holiday.', 'Holiday Creation- Notification','Dear Parent/Staff, on account of {holiday_name}, {start_date} - {end_date} will be a holiday.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (b38102ac-34d6-4c03-aadb-32bccfd7daf7,82ccb585-6625-49dc-b978-6570f4a83b9e, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Student', 'Holiday Updated- Notification','Dear Parent/Staff, the holiday for {holiday_name} has been change to {start_date} - {end_date}.', 'Holiday Updated- Notification','Dear Parent/Staff, the holiday for {holiday_name} has been change to {start_date} - {end_date}.', 'Holiday Updated- Notification','Dear Parent/Staff, the holiday for {holiday_name} has been change to {start_date} - {end_date}.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (b38102ac-34d6-4c03-aadb-32bccfd7daf7,82ccb585-6625-49dc-b978-6570f4a83b9e, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 3, 'Student', 'Holiday Cancelled- Notification','Dear Parent/Staff, the holiday for {holiday_name} on {start_date} - {end_date} has been cancelled.', 'Holiday Cancelled- Notification','Dear Parent/Staff, the holiday for {holiday_name} on {start_date} - {end_date} has been cancelled.', 'Holiday Cancelled- Notification','Dear Parent/Staff, the holiday for {holiday_name} on {start_date} - {end_date} has been cancelled.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (dd6d3d82-e5e5-440e-85ac-0681f19b07ba,2bbf5823-9384-4b26-bc45-aba1a11b36a0, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Timetable Creation- Notification','TT: Timetable for {class_name} {section_name} has been created for the Academic Year {academic_year}.', 'Timetable Creation- Notification','TT: Timetable for {class_name} {section_name} has been created for the Academic Year {academic_year}.', 'Timetable Creation- Notification','TT: Timetable for {class_name} {section_name} has been created for the Academic Year {academic_year}.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (dd6d3d82-e5e5-440e-85ac-0681f19b07ba,2bbf5823-9384-4b26-bc45-aba1a11b36a0, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 4, 'Student', 'Class Notes upload- Notification', 'Class notes for {subject_name} {class_hour_name} has been uploaded. Please refer them for more details.', 'Class Notes upload- Notification', 'Class notes for {subject_name} {class_hour_name} has been uploaded. Please refer them for more details.', 'Class Notes upload- Notification', 'Class notes for {subject_name} {class_hour_name} has been uploaded. Please refer them for more details.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (870e3768-9c7b-4d26-ba0c-c46d24a73ea6,73c60a5d-1e2a-46b3-b461-c2bf7927f0fa, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,  1, 'Employee', 'Leave Request Sent- Notification','Dear Staff, {staff_name} has requested leave on/for {start_date} {end_date}. Kindly approve the request.', 'Leave Request- Notification','Dear Staff, {staff_name} has requested leave on/for {start_date} {end_date}. Kindly approve the request.', 'Leave Request- Notification','Dear Staff, {staff_name} has requested leave on/for {start_date} - {end_date}. Kindly approve the request.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (870e3768-9c7b-4d26-ba0c-c46d24a73ea6,a39c6dd1-fccb-45ff-9cfc-87001acc9d44, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Employee', 'Leave Request Approved- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been approved.', 'Leave Approval Accepted- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been approved.', 'Leave Approval Accepted- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been approved.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (870e3768-9c7b-4d26-ba0c-c46d24a73ea6,a39c6dd1-fccb-45ff-9cfc-87001acc9d44, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Employee', 'Leave Request Denied- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been declined. Please contact your reporting head for further details.', 'Leave approval declined- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been declined. Please contact your reporting head for further details.', 'Leave approval declined- Notification','Your leave application {leave_type_name} for {start_date} {end_date} has been declined. Please contact your reporting head for further details.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (6f57fdf2-a978-4ebf-a111-31adeb578884,eebeb1e5-fb69-4b6f-be9b-c04f18b8cf72, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (6f57fdf2-a978-4ebf-a111-31adeb578884,eebeb1e5-fb69-4b6f-be9b-c04f18b8cf72, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', 'School Bus Pickup/Drop- Notification','Vehicle: {vehicle}, Current Location: {location} - Distance to your location {distance}.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (b4ee4435-9628-4cbd-ba82-fe204013c5fb,dc1c8fb4-c39c-4972-8c01-36b8912b8c0b, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Examination Schedule- Notification','Dear Parent, {exam_name} has been scheduled for {class} & %s {subjects} All the best!','Examination Schedule- Notification','Dear Parent, {exam_name} has been scheduled for {class} & %s {subjects} All the best!','Examination Schedule- Notification','Dear Parent, {exam_name} has been scheduled for your child {subjects} All the best!',true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (15d47cba-5206-42ea-8dd6-d6f3f635d7a3,91d07260-6c74-42d2-a9b4-1ec253f55ced, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Results- Notification','Results: %s examination. %s - %s','Results- Notification','Results: Examination results published. Please check your childs report card and send us your confirmation.','Results- Notification','Results: Examination results published. Please check your childs report card and send us your confirmation.',true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (a4afff4d-b478-4634-b4dc-cf1f804162ca,849525dd-6813-4fd3-aa9d-1b721da04fa7, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Special Timetable Creation- Notification','Dear Parent, {Date} is a working day. {Day} timetable will be followed.', 'Special Timetable Creation- Notification', 'Dear Parent, {Date} is a working day. {Day} timetable will be followed.', 'Special Timetable Creation- Notification','Dear Parent, {Date} is a working day. {Day} timetable will be followed.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (a4afff4d-b478-4634-b4dc-cf1f804162ca,849525dd-6813-4fd3-aa9d-1b721da04fa7, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Student', 'Special Timetable Updated- Notification','Dear Parent, Timetable followed for {Date} has been updated. Please follow {Day} timetable.', 'Special Timetable Updated- Notification', 'Dear Parent, Timetable followed for {Date} has been updated. Please follow {Day} timetable.', 'Special Timetable Updated- Notification','Dear Parent, Timetable followed for {Date} has been updated. Please follow {Day} timetable.', true); insert into school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values(54d3d176-1639-4fd8-9519-872057850b7d,5ff5e9c0-2bd6-49c2-84d5-102c5367dd6a, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Hall Of Fame Award- Notification','Dear Parent, your child %s has been awarded the {awardName} award.', 'Hall Of Fame Award- Notification', 'Dear Parent, your child has been awarded the {awardName} award.', 'Hall Of Fame Award- Notification','Dear Parent, your child {userName} has been awarded the {awardName} award.', true);"
    var ssdata ="INSERT INTO school_sender_type(sender_id, tenant_id, school_id, academic_year, media_id, media_name, sender_name) VALUES (fed830f3-e14e-4259-92b2-b5df95df5cc9, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, '2018-2019', 1, 'sms', 'NXTECH');"
    var termdata = "insert into school_terms(id, tenant_id, school_id, ac_year, term, end_date, start_date) values (e78ced2d-0034-4a4a-817c-ccf53a1bb56c, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, '2018-2019', 'Term 1' ,toTimestamp(now()), toTimestamp(now())); insert into school_terms(id, tenant_id, school_id, ac_year, term, end_date, start_date) values (af5327d0-484a-4ab9-ac19-aaef7c72c201, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, '2018-2019', 'Term 2' ,toTimestamp(now()), toTimestamp(now()));"
    var subData = "INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c0b8c806-76c5-424c-9880-16be04b4fa24,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', e44e0731-bbbd-44a3-9d46-26e7163f232c, 'English','E','#faedde','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (ff9f86c5-3b56-4fcd-95cb-3448766526aa,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 38124ff3-e1f0-4e57-a836-3fc61c14e634, 'Mathematics','M','#def2fa','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (ff9f86c5-3b56-4fcd-95cb-3448766526aa,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 8e330809-c7e3-456e-b4be-87b870086a99, 'Business Math','BM','#F1C3F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 2bf8b3a0-e503-4706-a456-a9650b2632ca, 'Science','S','#fce6ef','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', e87e6ebc-bdc4-4fdd-9eca-015feff123df, 'Physics','PH','#D4F7E5','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 4f2cdfcc-16d4-4ad4-b038-fcb2c0893679, 'Chemistry','CH','#C3D0F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 746a175c-58eb-4eb6-a61e-0584bdc618a0, 'Biology','B','#D7C3F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 844669b8-5ecd-44da-b006-cea26b330f06, 'Botany','BO','#D7C3F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (c6f0e5ca-5214-45a6-897a-02e51349b08f,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 6bfd1806-8d8c-45b1-8b7a-6ecd16ca23e3, 'Zoology','ZO','#F1C3F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (79c697f3-8c1b-4067-a1a3-0f5aeaff55d7,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019',1293b93d-6253-4b88-b0f3-6a5436214a38, 'Economics','EC','#D4F7E5','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (79c697f3-8c1b-4067-a1a3-0f5aeaff55d7,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', bb74ed6b-e540-4e18-b3c5-eb77bcf2c255, 'Accountancy','AC','#C3D0F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (79c697f3-8c1b-4067-a1a3-0f5aeaff55d7,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 327e2203-21e6-4250-a8f1-3e1fb72178fc, 'Statistics','ST','#D7C3F9','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (79c697f3-8c1b-4067-a1a3-0f5aeaff55d7,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 3d1cf437-7ead-40ea-9fbb-7650fde29d97, 'Business Studies','BS','#F9C3EC','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (6894f711-2b4d-4a14-b74b-a9c310954812,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', dde18518-dfce-408d-b308-0dc41e09a803, 'Social Science','SS','#EDC5C6','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (6894f711-2b4d-4a14-b74b-a9c310954812,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019',29985753-9fb9-4da7-9898-77039336e71d, 'History & Civics','HC','#EAC5ED','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (6894f711-2b4d-4a14-b74b-a9c310954812,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019',67b7d62b-45e2-415a-9e32-5c509cec7ecb, 'Geography','GE','#CCEDC5','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (6894f711-2b4d-4a14-b74b-a9c310954812,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', ac7bc5f3-5abe-4133-b33f-f0d2a2f4190e, 'Political Science','PSC','#faedde','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (e3f22e75-a3a4-4710-b978-8399919d2b3a,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019',f1d8868e-f80d-4b08-8ba8-9853a94858e7, 'Tamil','TA','#fafce6','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (e3f22e75-a3a4-4710-b978-8399919d2b3a,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 0eab5044-61f0-48fb-adcc-65bc0897a57d, 'Telugu','T','#def2fa','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (e3f22e75-a3a4-4710-b978-8399919d2b3a,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 5be093a3-67f8-4ca3-93da-8935914fae72, 'Hindi','H','#e6fcf3','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (e3f22e75-a3a4-4710-b978-8399919d2b3a,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', afdb5085-a02f-4574-ad74-740597843e2c, 'Malayalam','MA','#ebe6fc','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (e3f22e75-a3a4-4710-b978-8399919d2b3a,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 3df8e7e8-4d3c-4e94-9028-87dc852da946, 'Kannada','KA','#DFFADE','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (9fe9a42b-5aaf-4235-bf6c-aee55b59f8cb,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 402751b9-0a88-4081-b26c-2fd998423165, 'Computer Science','CS','#fce6ef','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (b0572048-1d8e-43af-9395-fd133b1a6333,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 353d5fa6-a3ee-4fa7-be7c-31ceed948e56, 'Physical Education','PE','#def2fa','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 8e88b328-d6b9-4e6e-8443-13953e561d96, 'Value Education','VE','#ebe6fc','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', c471b3af-5960-4416-b472-bb0443028170, 'Work Experience','WE','#DFFADE','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', af157173-1954-473d-bce9-37e6643aaaaf, 'Psychology','PS','#EDC5C6','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 764ec0d0-b793-43d9-bb44-ad33520e5eba, 'Newspaper In Education','NE','#fafce6','', toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 3a0f16e7-8f80-41ff-8912-558b82b5e5c8, 'General Knowledge','GK','#e6fcf3','' , toTimestamp(now()), 'Admin','Admin',true, true); INSERT INTO nsa.school_subjects (dept_id, tenant_id, school_id, academic_year,subject_id,sub_name, sub_code, sub_colour,sub_desc, updated_date, updated_by, updated_username, default_value, status) values (f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,8eb846a0-4549-11e7-9543-276f818a8422,1b11c6ec-cd59-4269-b91a-4e45ec4d50b4,'2018-2019', 98ee602d-6140-484e-842e-634fbf44d0c6, 'General Science','GS','#F9C3EC','', toTimestamp(now()), 'Admin','Admin',true, true);INSERT INTO nsa.school_subjects (tenant_id,school_id,academic_year,subject_id,default_value,dept_id,status,sub_aspects,sub_code,sub_colour,sub_desc,sub_name,updated_by,updated_date,updated_username) VALUES ( 8eb846a0-4549-11e7-9543-276f818a8422,@school_id ,'2018-2019',0886e72b-0a4e-4c4e-88b4-bee43e63703f,false,6894f711-2b4d-4a14-b74b-a9c310954812,true,NULL,'EVS','#F1C3F9','','EVS','Admin','2017-06-05 19:49:38','Admin');"
    var sfData ="INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',08103110-6b9d-4dd9-a0e2-976909313148,1,'2017-05-03 16:23:50',NULL,'92585ffc-ee5a-49ad-951c-912fc3a87eff/08103110-6b9d-4dd9-a0e2-976909313148/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',42f01fd0-0040-4c54-913c-22baabbe4c79,'Academics','icon-books',NULL,NULL,'',92585ffc-ee5a-49ad-951c-912fc3a87eff,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Academics',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,mobile_priority,is_channels,is_override,help_text, notify_hostelers,screen) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1032c757-97aa-4190-b539-6eaa75e44879,0,'2017-05-03 16:23:50',NULL,'92585ffc-ee5a-49ad-951c-912fc3a87eff/1032c757-97aa-4190-b539-6eaa75e44879/',NULL,NULL,NULL,false,'2035-05-03 16:23:50',165b1b99-082b-4c44-850b-5f28b0869baf,'Dashboard','icon-home7',NULL,NULL,'/',92585ffc-ee5a-49ad-951c-912fc3a87eff,true,'St. Pauls Hi-Tech High School',true,true,NULL,'Dashboard',['Employee', 'SchoolAdmin'],1,false,false,'',false,'Home'); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',01c3f7e0-a8ef-4fbb-81fb-b8c7fce0b12b,0,'2017-05-03 16:23:50',NULL,'2557f2f4-c752-4ba5-85b3-be1a15f1c3eb/01c3f7e0-a8ef-4fbb-81fb-b8c7fce0b12b/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',0d215196-b0f7-4d16-8003-f2887384e66f,'Department','icon-lan',NULL,NULL,'./department',2557f2f4-c752-4ba5-85b3-be1a15f1c3eb,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Department',['Employee', 'SchoolAdmin'],false,false,'School Departments can be used to categorize employees, subjects and administration. Departments can be classified as academic departments such as subject wise or as non academic like accounts or transport. Departments can be associated with employees and subjects in school. A predefined set of  departments in school are listed on the table below and any custom department can be added by clicking on Add New Department with the department name and description.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d2f07a89-9875-4c0c-96f3-cefe8254b91a,1,'2017-05-03 16:23:50',NULL,'2557f2f4-c752-4ba5-85b3-be1a15f1c3eb/d2f07a89-9875-4c0c-96f3-cefe8254b91a/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',af4e2130-6eb1-4b36-8907-dcd09f704e6b,'Designation','icon-sort-amount-desc',NULL,NULL,'./designation',2557f2f4-c752-4ba5-85b3-be1a15f1c3eb,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Designation',['Employee', 'SchoolAdmin'],false,false, 'Designations of all employees in school can be maintained and associated while adding new employees. A set of prepopulated designations are provided on the table below and any new designation can be added by clicking on Add New Desgination with the name and description of the designation.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2557f2f4-c752-4ba5-85b3-be1a15f1c3eb,0,'2017-05-03 16:23:50',NULL,'5e8d3f3c-1d7e-4cba-be8b-413b4f223479/2557f2f4-c752-4ba5-85b3-be1a15f1c3eb/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',cee8b6da-52ce-45be-946d-eabd3452b2ff,'Employee Management','',NULL,NULL,'',5e8d3f3c-1d7e-4cba-be8b-413b4f223479,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Employee Management',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',da60c00d-7356-43db-bf03-9cb6561a5bb9,2,'2017-05-03 16:23:50',NULL,'2557f2f4-c752-4ba5-85b3-be1a15f1c3eb/da60c00d-7356-43db-bf03-9cb6561a5bb9/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',843f0088-128e-476a-a69c-8320c46ad0bf,'Employees','icon-users2',NULL,NULL,'./employees',2557f2f4-c752-4ba5-85b3-be1a15f1c3eb,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Employees',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c4f852be-a6c0-41a1-8fcd-3b075e35a8b1,1,'2017-05-03 16:23:50',NULL,'a7337b14-90d1-4d88-bfb7-292b087ade36/c4f852be-a6c0-41a1-8fcd-3b075e35a8b1/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',0f91ad31-2ded-4786-ac65-045eb77b7ec0,'Section Allocation','icon-tree5',NULL,NULL,'./section-allocation',a7337b14-90d1-4d88-bfb7-292b087ade36,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Section Allocation',['Employee', 'SchoolAdmin'],false,false,'The available sections can be allotted to each of the classes that have been provided. To associate sections with a class, click on Associate Section and choose the class for which the association is to be done. Choose the sections that are to be added under the particular class and provide the class strength. The allocations that are done can be found in the table below.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1b331ce5-589f-4726-812e-44d456a2d5c9,0,'2017-05-03 16:23:50',NULL,'a7337b14-90d1-4d88-bfb7-292b087ade36/1b331ce5-589f-4726-812e-44d456a2d5c9/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',b454c06d-6b21-4dd0-9d8d-d589ac6203d9,'Section List','icon-list',NULL,NULL,'./section-list',a7337b14-90d1-4d88-bfb7-292b087ade36,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Section List',['Employee', 'SchoolAdmin'],false,false,'All the sections present in your school can be added here. To add a section, click on Add Section and provide section name and the status of the section. Sections can later be deactivated if necessary by clicking on edit button against the respective Section and then changing the status to Inactive. The previously added sections can be found in the table below. ',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',a7337b14-90d1-4d88-bfb7-292b087ade36,3,'2017-05-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/a7337b14-90d1-4d88-bfb7-292b087ade36/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',3bb0b450-5705-402a-b9f1-1e78efc765af,'Sections','icon-lan2',NULL,NULL,'',08103110-6b9d-4dd9-a0e2-976909313148,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Sections',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3f48a4bc-240c-4a47-95c1-e5f152a2fd18,2,'2017-05-03 16:23:50',NULL,'5e8d3f3c-1d7e-4cba-be8b-413b4f223479/3f48a4bc-240c-4a47-95c1-e5f152a2fd18/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',c8d691cc-cb45-4c88-a489-1611c77e5105,'Student Management','',NULL,NULL,'',5e8d3f3c-1d7e-4cba-be8b-413b4f223479,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Student Management',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',552959c7-f683-492f-be38-a3fe4d2dc014,0,'2017-05-03 16:23:50',NULL,'3f48a4bc-240c-4a47-95c1-e5f152a2fd18/552959c7-f683-492f-be38-a3fe4d2dc014/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',33b667c3-768c-4bc7-9b10-7bfb34e112e0,'Students','icon-man-woman',NULL,NULL,'./students',3f48a4bc-240c-4a47-95c1-e5f152a2fd18,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Students',['Employee', 'SchoolAdmin'],false,false,'Information about all the students of the school can be added here. The students can be added by clicking on Add Student and providing the relevant information about the student and their parents including emergency contact information.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,76f15814-94a2-11e8-9eb6-529269fb1459,'2018-2019',db784fd5-f963-4b6a-8c96-03f475ccf439,0,'2017-05-03 16:23:50',NULL,'f10fae6d-f72e-494b-b84e-188f018bab5c/db784fd5-f963-4b6a-8c96-03f475ccf439/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',25af9881-29b6-4c2e-8f22-e5fb7b1894a9,'Students Promotion','icon-graduation',NULL,NULL,'./student-promotions',f10fae6d-f72e-494b-b84e-188f018bab5c,true,'NEXSCHOOLAPP',true,true,NULL,'Students Promotion',['Employee', 'SchoolAdmin'],false,false, 'Student Promotions feature can be used to promote students from one class to the next. Students can be promoted by clicking on Promote Students button and selecting the class and sections of students to be promoted. Then click on Next and select the respective sections of the higher class to which the students are to be promoted from the existing sections. Then select the students to be promoted to the higher class by clicking on the checkbox against the respective students. To select all students, click on the checkbox at the top of the column. Then click on next and verify the promoted students list and their respective promoted classes and sections. The promoted students and depromoted students count can be checked in the top right of the screen. Select the notification channels to be used for notifying the parents and then click on Promote to promote the students. Once promoted, the promoted students list can be seen for the respective classes by clicking on the green action button under the Action column. The depromoted students list can be seen for the respective classes by clicking on the red action button under the Action column. Depromoted students can be promoted by selecting the target section and clicking on Promote for each student. Promotions Report can be used to take reports of promoted students from respective classes and sections. Click on Promotions Report button and select the class and sections for which the report is to be generated. Click on Generate Report to get the report.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',be33380d-4990-4f4c-9bda-ee4312e8bfbd,1,'2017-05-03 16:23:50',NULL,'ee8dc38e-6823-4252-a918-ccd1e78347e6/be33380d-4990-4f4c-9bda-ee4312e8bfbd/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',14090897-1b45-4789-ba6b-6ddd400119ea,'Subject Allocation','icon-book',NULL,NULL,'./subject-allocation',ee8dc38e-6823-4252-a918-ccd1e78347e6,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Subject Allocation',['Employee', 'SchoolAdmin'],false,false,'The subjects that are applicable for respective classes can be specified here. To allocate subjects, click on Associate Subjects and select the classes to be assciated with subjects. Then select the subject(s) applicable for the selected classes and specify if the subjects are academic or non-academic. The previously added subject allocations can be found in the table below.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2ebfe4ef-77ba-4c12-ae37-14ae008a33e4,0,'2017-05-03 16:23:50',NULL,'ee8dc38e-6823-4252-a918-ccd1e78347e6/2ebfe4ef-77ba-4c12-ae37-14ae008a33e4/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',02644cd2-7491-404f-b18c-bd35cc5c0cbd,'Subject List','icon-list2',NULL,NULL,'./subject-list',ee8dc38e-6823-4252-a918-ccd1e78347e6,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Subject List',['Employee', 'SchoolAdmin'],false,false,'Subject List contains all the subjects that are available in your school. Subjects can be added by clicking on the Add Subject button and providing the department name, subject name and the subject code. The subjects added here can later be used for assigning to teachers, setting up timetable and setting up exams. The previously added  subjects can be found in the table below.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ee8dc38e-6823-4252-a918-ccd1e78347e6,4,'2017-05-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/ee8dc38e-6823-4252-a918-ccd1e78347e6/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',e9e7be8b-1c22-4cdf-b6b6-add83018b4e4,'Subjects','icon-notebook',NULL,NULL,'',08103110-6b9d-4dd9-a0e2-976909313148,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'Subjects',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5e8d3f3c-1d7e-4cba-be8b-413b4f223479,2,'2017-05-03 16:23:50',NULL,'92585ffc-ee5a-49ad-951c-912fc3a87eff/5e8d3f3c-1d7e-4cba-be8b-413b4f223479/',NULL,NULL,NULL,false,'2020-05-03 16:23:50',bd6eb55e-2a82-4734-83e0-5db2451618e7,'User Management','icon-users4',NULL,NULL,'',92585ffc-ee5a-49ad-951c-912fc3a87eff,true,'SHANTHINIEKATHAN MATRIC SCHOOL',true,true,NULL,'User Management',['Employee', 'SchoolAdmin'],false,false,'',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',db784fd5-f963-4b6a-8c96-03f475ccf439,0,'2017-05-03 16:23:50',NULL,'f10fae6d-f72e-494b-b84e-188f018bab5c/db784fd5-f963-4b6a-8c96-03f475ccf439/',NULL,NULL,NULL,false,'2035-05-03 16:23:50',25af9881-29b6-4c2e-8f22-e5fb7b1894a9,'Students Promotion','icon-graduation',NULL,NULL,'./student-promotions',f10fae6d-f72e-494b-b84e-188f018bab5c,true,'NEXSCHOOLAPP',true,true,NULL,'Students Promotion',['Employee', 'SchoolAdmin'],false,false, 'Student Promotions feature can be used to promote students from one class to the next. Students can be promoted by clicking on Promote Students button and selecting the class and sections of students to be promoted. Then click on Next and select the respective sections of the higher class to which the students are to be promoted from the existing sections. Then select the students to be promoted to the higher class by clicking on the checkbox against the respective students. To select all students, click on the checkbox at the top of the column. Then click on next and verify the promoted students list and their respective promoted classes and sections. The promoted students and depromoted students count can be checked in the top right of the screen. Select the notification channels to be used for notifying the parents and then click on Promote to promote the students. Once promoted, the promoted students list can be seen for the respective classes by clicking on the green action button under the Action column. The depromoted students list can be seen for the respective classes by clicking on the red action button under the Action column. Depromoted students can be promoted by selecting the target section and clicking on Promote for each student. Promotions Report can be used to take reports of promoted students from respective classes and sections. Click on Promotions Report button and select the class and sections for which the report is to be generated. Click on Generate Report to get the report.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1fd2b1ff-c6cf-46c2-a0aa-a15c10282adc,0,'2017-05-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/1fd2b1ff-c6cf-46c2-a0aa-a15c10282adc/',NULL,NULL,NULL,false,'2035-05-03 16:23:50',8e980e79-12ab-40c3-912a-a8903389141f,'Academic Year','icon-calendar52',NULL,NULL,'./academics-year',08103110-6b9d-4dd9-a0e2-976909313148,true,'St. Pauls Hi-Tech High School',true,true,NULL,'Academic Year',['Employee', 'SchoolAdmin'],false,false,'The list of academic years can be viewed here along with the number of terms and duration.',false); INSERT INTO nsa.school_feature (tenant_id,school_id,academic_year,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text, notify_hostelers) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7c156168-f92d-4479-a68f-eb5e97bed06b,2,'2017-05-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/7c156168-f92d-4479-a68f-eb5e97bed06b/',NULL,NULL,NULL,false,'2035-05-03 16:23:50',6e45e5df-c2f1-4c35-b3a5-35cfac70926b,'Classes','icon-tree6',NULL,NULL,'./classes',08103110-6b9d-4dd9-a0e2-976909313148,true,'St. Pauls Hi-Tech High School',true,true,NULL,'Classes',['Employee', 'SchoolAdmin'],false,false,'All the classes of the school are displayed in the table below. The classes can be the activated or deactivated here by using the switch.',false);"
    var srPData = "INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll', d1ec1f14-5ad2-443e-aae6-54709c02ba84: 'voice_sms_manageAll',7ce58493-7033-4ff6-ab8e-2269bc7906d6:'hall_of_fame_manageAll',849725fb-f1fc-41ac-9f73-29f9c250e385:'Parent_information_manageAll', d4c31402-ef87-11e7-8c3f-9a214cf093ae:'student_promotion_manageAll', 6c29bfcc-f153-11e7-8c3f-9a214cf093ae:'shuffle_student_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin'); INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49, {08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll', 21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll', 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage', 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll', 34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll', 3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage', 4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage', 4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll', 52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll', 5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage', 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll', 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll', 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage', 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage', 803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll', 9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll', ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll', ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage', af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll', c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll', cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage', cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage', ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage', d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll', d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage', dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll', ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll', ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll', f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage', fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll', 8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll', 780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage', 54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll', 24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll', de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll', 3673d070-987e-4faf-aa15-aa131111a98c:'hall_of_fame_manage', 7ce58493-7033-4ff6-ab8e-2269bc7906d6:'hall_of_fame_viewAll', 6c29baa4-f153-11e7-8c3f-9a214cf093ae:'shuffle_student_viewAll',6c29bcde-f153-11e7-8c3f-9a214cf093ae:'shuffle_student_manage', d4c30d9a-ef87-11e7-8c3f-9a214cf093ae:'student_promotion_viewAll', d4c31146-ef87-11e7-8c3f-9a214cf093ae:'student_promotion_manage' },'Faculty Manager','admin','2017-06-24 16:22:04','Admin');";
    var sAwData = "INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(9eba5d6b-e389-4105-8894-903c1c81c76c,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c04630c0-90fe-4713-857f-3e1c5bdb24f9,'Honour Roll',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(47bf3ddf-2533-493e-9cef-f7481c94af3e,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f9f52f38-28f1-41b5-a2dd-b21e5d118554,'Star of the Month',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(7b95d675-133b-499c-90f1-efd53402c330,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',971d9251-f322-4dec-949c-fbbf1b5219bb,'Penmanship',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(fe1568d8-26ec-4c35-ab12-a142bed254e1,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ff336670-2e8d-4d2b-ad9a-2b8c5c0c0dbc,'Perfect Attendance',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(410823ee-cf70-429f-b403-d2f120b107cc,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f9d825a6-9cf6-499b-863f-58ce0c2dbab7,'Star Reader',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(75f2da2b-0a51-4060-b248-3ce39e0bb55a,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',989fb2d9-8340-4e56-8806-440882d2f3dd,'Best Class Leader',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(a30a884c-cc7d-45df-b451-4c3b7c3fb652,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',add2d2f2-83d7-43d8-9fde-ff5531e88983,'Super Speller',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(663c815d-be2b-4c57-ad54-990a81b6e6e2,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6450a827-9627-40ac-aff0-557bbb002a96,'Impeccable Manners',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(5ff7e939-1f5e-4f95-85c9-bcd1321372aa,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ebb90f23-e01f-4dc6-be84-7c04868a766d,'Young Scientist',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(77dc2396-d020-4f98-9987-033cf04cdef6,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e201f5fa-4237-4f3f-a34e-c10b0b6050f4,'Prompt Worker',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(3f892433-b89e-4498-9b93-9055efe58f32,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c89be1a9-4b85-48ae-a9b4-2db2b582f92e,'Queen / King of Art & Craft',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(7aac4431-1f43-4f1d-b6cf-829e0cf5aa04,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',704a23ec-1c83-4180-8a87-ff879fb374db,'Maths Whiz',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(a46e3bfc-05f4-4b0f-ba2f-35ca94304184,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ecb30342-60d9-46a7-9033-31b4b9fbc494,'Most Valuable Player',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(b6534d23-5f56-480b-b108-4d47fb5a6bca,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',54551df0-b415-441d-be07-65f96a28a6e2,'Aspiring Author',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(8e6b5ffe-c571-45a7-8093-f8c72a5ed081,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6f6b609f-3bdd-40e6-a7ca-c3ae13141f86,'Most improved Student',true,''); INSERT INTO nsa.school_award(id,tenant_id, school_id,academic_year,award_id,award_name,status,description) values(fa7844f3-93ab-4eb4-8c6d-e86004ec657e,8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c922a164-bdda-42ab-ab3b-2b9f9205d95b,'Eloquent Speaker',true,'');"
    var classDetails = "insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0,  596152fe-e748-4778-b91d-e192d7c89d32, 'PRE K.G', 'PRE K.G', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1, c4dcadd0-ea0d-11e6-8b3a-9d7cc28d7ccd, 'L.K.G', 'L.K.G', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2, c4e33d80-ea0d-11e6-8b3a-9d7cc28d7ccd, 'U.K.G', 'U.K.G', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3, c4e44ef0-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 1', '1', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',4, c4e56060-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 2', '2', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019', 5,c4e6bff0-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 3', '3', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6, c4e81f80-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 4', '4', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7, c4e97f10-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 5', '5', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',8, c4ea9080-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 6', '6', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019', 9,c4eba1f0-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 7', '7', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',10, c4ec3e30-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 8', '8',toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019', 11,c4ed4fa0-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 9', '9', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',12, c4ee3a00-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 10', '10', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019', 13,c4eefd50-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 11', '11', toTimeStamp(now()), 'Admin', 'Admin', true); insert into school_class_details(tenant_id, school_id, academic_year,order_by, class_id, class_name, class_code, updated_date, updated_by,updated_username, status) values (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019', 14,c6445420-ea0d-11e6-8b3a-9d7cc28d7ccd, 'Class 12', '12', toTimeStamp(now()), 'Admin', 'Admin', true);"

    var template = "insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (18c33cd5-653c-49c8-93ad-45529eaccc09, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admission', 'Dear Parent,  you are requested to submit the admission form along with the registration fees Amount of *amt* before *Date* from *time* AM to *time* PM'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (6d8ac222-e243-41a3-a982-318eac892a67, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'School opening', 'Dear Parent, school opens for your ward on *date*. Kindly visit school and receive the School Kit by paying amount *Amt*'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (c2442c04-a590-4399-a6ca-45673d5cbeac, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Welcome message', 'Welcome to *name*. For any support or queries please contact *name* *contact number*'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (b43fcc82-949f-45dd-8cab-b0c495e58157, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Item Collection', 'Dear Parent, kindly collect the *item name* , distributed on *date* from *time* AM to *time* PM'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (b85109c6-e476-42f7-93e2-0c25f3894ad8, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Homework', 'Dear Parent, Homework for *description*. Make sure your ward is completing the homework regularly.'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (36823669-fc9a-4dd2-841f-e49e1b7b5ae5, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'One day leave', 'Dear Parent, *date* will be holiday on occasion of *holiday name*.'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (3c91ae89-172c-4a7e-b08e-3415650167a5, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'PTA Meeting', 'Dear Parent, PTA meeting has been scheduled on *Date* from *time* AM to *time* PM. Please attend the meeting at *Venue* and collect the report card. Thanks, Management.'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (6245a2dc-9f17-4be9-8044-a25f416d84c5, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Emergency leave', 'Dear Parent, school remains closed on *date* due to *event/reason*'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (d6647724-93ac-4679-a1aa-41d05f66efb4, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Vacation Break', 'Dear Parents, The School will remain closed from *Date* to*Date* on account of *Reason*. School Reopens On *Date*. Attendance is mandatory on first day.  Regards, Management'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (a0b32758-86bb-4d1f-a2f1-a09194e04742, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Last working day', 'Today is the last working day of term *name*. School reopens on *date*'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (2560edb4-0582-4154-a7ef-91b5d33a493a, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'School trip', 'Dear Parent, School trip/ picnic to *place* has been organized for *class names*. Interested students can pay amount of *amt* to their respective class incharges. '); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (554258da-ba0a-435f-a391-05ccbfd6a5b4, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Examinations', 'Dear Parents, *Exam Name* has been scheduled for Classes *Class names* from *Start Date* to * End date*. Please refer portions accordingly. All the Best. Thank You, Management'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (ee17335e-00e8-4846-909e-e46396361ccc, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Results', 'Dear Parents, Results for *exam name* are out on *date*. Please check the progress report and send your confirmation.'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (a79cee6c-5602-4058-9a13-6379a3e9b835, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Event', 'Dear Parent, warm welcome to *event* to be held on *date* We appreciate your presence and support!'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (034bdb45-85ae-46f4-b8a4-33f03739823f, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Competition', 'Dear Parent, *competition name* will be held on *duration* at *venue*. Ensure to be present on time with your Child registration details'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (1f2fcc42-35ea-4444-adab-487ab3bd3b9a, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Fee', 'Dear Parent, Payment for Annual Fee for *Academic/Term Year* is due. Login to *website name* and pay at the earliest. Please ignore if already paid. Regards, Management.'); insert into school_template(template_id, tenant_id, school_id, template_title, template_message) values (33cad9cf-c0b7-47b4-aee5-1be34b06ecdb, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Payment confirmation', 'Dear Parent, Fee for the Quarter *Name of Term* for the academic Year *Academic Year* has been paid on *Date*. You can download Fee receipts on our website. Regards, Management.');"

    var department = "insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( ff9f86c5-3b56-4fcd-95cb-3448766526aa, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Mathematics', 'Math Dept', 'Default', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( c6f0e5ca-5214-45a6-897a-02e51349b08f, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Science', 'Science Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Humanities', 'Humanities Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( e29d7da5-09ac-4cd2-9c3d-86741cf9e60f, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Administration', 'Administration Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( b8d59224-1d32-4034-a25a-cbb1e4bb62e3, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Transport', 'TR Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( 9fe9a42b-5aaf-4235-bf6c-aee55b59f8cb, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Computer Science', 'CS Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( b0572048-1d8e-43af-9395-fd133b1a6333, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'PE', 'Sports Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( 541a0469-1286-4df5-b8d5-58b291508b90, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Reception', 'Helpdesk Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( e3f22e75-a3a4-4710-b978-8399919d2b3a, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Language', 'Language Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( 79c697f3-8c1b-4067-a1a3-0f5aeaff55d7, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Accounts', 'Finance Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( 5616e9f4-c9fd-4b98-984f-69dd871deb2a, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Clerical', 'CR Dept', 'Admin', toTimestamp(now()), 'Admin', true, true); insert into nsa.school_department(dept_id, tenant_id, school_id, dept_name, dept_alias, updated_by, updated_date, updated_username, default_value, status) values( 547bc01b-e3f1-400f-9114-68d473a45c42, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Art & Craft', 'Art Dept', 'Admin', toTimestamp(now()), 'Admin', true, true);"

    var designation = "insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (8161700b-642d-40d0-b9fd-fd9af867c549,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Principal', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (d1b718f2-0ef1-4a06-8f08-f76535bf90eb,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Chairman', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (00c21432-e23f-4c35-9cbb-9c5696066aa9,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Chairperson', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (11eca079-d80a-4355-8687-856d4452dde4,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Vice Principal', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (48dbe0f6-5608-49fe-84b6-74add2617a99,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Head Master', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (cdc3ed05-87ea-4b60-b6c3-69d60924b37b,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Dean', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (95dea402-b470-4734-b075-1b45e1d2ec32,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Class Incharge', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (24cadf96-4c2d-4639-a5b4-884429a63015,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Subject Co oridinator', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (87e69198-716e-4ce3-a7a4-72bee91d5023,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Junior Staff', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (27e381e4-b676-43c0-af56-0539413d899e,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Senior Staff', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (d710fa78-53c4-4832-9041-4faec67c8d1a,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Accountant', toTimestamp(now()), 'Admin', 'Admin', true, true); insert into nsa.school_designation (desg_id, tenant_id, school_id,desg_name, updated_date,updated_by ,updated_username, default_value, status) values (7aa92cb4-8016-4a8e-bd7e-994a11c84ddc,8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Clerk', toTimestamp(now()), 'Admin', 'Admin', true, true);"

    var taxanomy = "INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',45c1e4e8-23b3-43cc-81e8-5999884d51f5,NULL,5010a35c-e87d-11e6-bf01-fe55135034f4,'All Employee',0,60109d80-e87d-11e6-bf01-fe55135034f3,true,'C'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',331dc52c-b36d-4c1b-a5ad-e2e402bfe485,NULL,5010a262-e87d-11e6-bf01-fe55135034f3,'All Classes',1,60109d80-e87d-11e6-bf01-fe55135034f3,true,'C'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',cea6a0a3-42c9-4c6c-8dda-2110740aad88,NULL,596152fe-e748-4778-b91d-e192d7c89d32,'NURSERY',0,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',39e494c1-950e-4e47-b8f5-a63e71996f4a,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,cea6a0a3-42c9-4c6c-8dda-2110740aad88,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e21d0bbd-c345-49bf-b8ed-a4b283f0cb03,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,cea6a0a3-42c9-4c6c-8dda-2110740aad88,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f915cf2a-7d23-4223-b236-3294383424a1,NULL,c4dcadd0-ea0d-11e6-8b3a-9d7cc28d7ccd,'L.K.G',1,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6ad3d572-82a5-44f7-b7b7-5634a525517a,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b15975af-eb05-4098-af94-b8e6b89595fb,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b49a85f3-ce3f-4445-b974-938cbb96a61f,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ede699d7-d63f-4434-80cf-986524d2046a,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0c7dac40-b1bd-4c05-b0f4-e1b9598cdab3,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5cad0c18-0578-4238-81a5-8ddd6366c581,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,f915cf2a-7d23-4223-b236-3294383424a1,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2ad47303-37a8-443e-b411-4f8e0da304a7,NULL,c4e33d80-ea0d-11e6-8b3a-9d7cc28d7ccd,'U.K.G',2,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e351c6be-1c9f-475b-88bb-824bc642cec8,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6b47483b-9c1a-47ed-a349-f8fb62872739,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6702e1b6-3e2f-4842-b9bc-1882b28bc777,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3a93177b-a2a5-41e7-bb78-79c672bb60f8,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',8ce4e60c-939a-4807-b47f-35fa243a5e44,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6b2d9641-95a0-4385-b692-58f8f0dffcab,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,2ad47303-37a8-443e-b411-4f8e0da304a7,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',059ecc7d-de77-4408-af74-f0b51a682e3a,NULL,c4e44ef0-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 1',3,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',4eaa94b0-ff74-44c9-ba6e-f1de4abd1b3f,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b882aa5b-a9f8-488d-ad1c-e7c8e4132697,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1511ef48-d011-4265-8896-89dd43a86443,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',84d9f2a5-fa92-464f-afad-8e0cb47c2fd6,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6e54de22-19b5-4e53-a69e-17d1293cce32,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',732f6b94-a84f-44fa-af07-f20adc9153d6,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,059ecc7d-de77-4408-af74-f0b51a682e3a,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,NULL,c4e56060-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 2',4,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c0884211-357e-4c21-b53d-1ff63911a83e,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',56604fdd-8bc4-4ae9-a519-91671fe31a47,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',af91533f-471a-44a8-853c-fbe2f0338251,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7588b054-6f7a-49f5-9143-a032d8b3a22a,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3089fc28-ed1c-4510-8cbd-9c7f967af117,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3fa0dd5e-6cd3-4138-8148-39c7f3fc2b26,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,17ca8df4-1b25-4b42-9c63-ba0e8ba9ce5e,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',dc748ba7-3eed-4cd0-a0ba-11772e02821c,NULL,c4e6bff0-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 3',5,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',4b08d7fa-dfe0-475a-a89c-d622d34c6882,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',4247e60c-f3d3-4e1b-a817-bc9264d2cf08,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0a94fd3f-fefb-4ac3-bb5c-2cca7c661f0b,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0e7e8f4d-25ad-44f8-a082-284308a58325,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7d18c1cf-0228-41d3-a3c1-7feb577f9bb5,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7c773f65-d229-45f9-8159-2de22deafea9,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,dc748ba7-3eed-4cd0-a0ba-11772e02821c,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',251e2a98-0a64-4bc8-9da8-e8cef2826008,NULL,c4e81f80-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 4',6,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6e6b044d-47ac-4c26-a98f-a993d15d929f,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ec6410e3-5b48-44e2-88c3-27b56dbefcbb,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b3b4cde8-a06b-41ea-9ecc-5c2fb71cf94a,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5d59784a-1934-4466-a88a-b81e6d5a334b,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0f52ce6e-eac6-4fb5-8ab5-6180af53c1a8,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5a41780c-a7c8-4324-8887-95ecb90398ec,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,251e2a98-0a64-4bc8-9da8-e8cef2826008,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ba7cd319-c112-4cda-bf0c-539da1f512ca,NULL,c4e97f10-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 5',7,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0fcc3c10-f7e3-4d21-9e9e-df08c12599d1,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',083eed37-84d2-45d6-a3f4-649b30833a93,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b42f309c-8a24-44d6-a88c-9cad5dda4eeb,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',9f86a147-2538-44d9-86d0-2ef8e7442815,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',25e9c400-8f38-4610-96ca-6c7e649a9fcd,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d51826b3-0b89-4ff6-9546-20892eb2dfe0,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,ba7cd319-c112-4cda-bf0c-539da1f512ca,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,NULL,c4ea9080-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 6',8,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',33e1b00a-dafd-49ac-8378-90331b17461d,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e9b99397-cf9d-4b2c-ac97-2ab3b719a650,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',05b94f4c-c436-4336-8359-81726b169115,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5206ba51-4079-46a5-8b3d-ad2a62da4953,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',72a0d331-7f92-4865-b64e-e8ae21c4487a,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',fc7444be-8dff-4f1d-a2d8-4d5fd95b0536,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,0b22d4ec-c0be-4aaa-b10d-3c2a757d47d9,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c42e7f81-4a97-41c7-b037-81ffe6eb035f,NULL,c4eba1f0-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 7',9,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',48dee9cd-9550-484c-abec-6205708398eb,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',a4e8030e-a306-4438-ade3-5e6f60466ddc,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f523ba9f-715a-4f8e-8806-8823e92203ea,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',9190ee13-1d23-4329-869e-31ad500a34bd,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',00bc7a7e-b4a6-4980-90b4-d516548f129f,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c3fb6d5d-1f03-4c92-8874-a032b82ae9a8,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,c42e7f81-4a97-41c7-b037-81ffe6eb035f,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',cd64787c-1635-467b-9e15-a8bdd72abd8d,NULL,c4ec3e30-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 8',10,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0573a596-c3ad-4be7-aac3-f127632b89ac,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',05b3aa35-01bd-4ec3-9ee6-df0903e81813,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c100cd3f-f255-4fc2-97e1-6a3e9a0c3312,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7320b630-ba9c-49dc-9bf6-87a315420cda,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',63af99e2-3b18-4f62-94c1-21c4fc125d16,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',fd6eea5b-e23b-40fa-ab29-62ef6d3bb710,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,cd64787c-1635-467b-9e15-a8bdd72abd8d,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',057234c4-9db9-4dd9-815d-ebb0b4095610,NULL,c4ed4fa0-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 9',11,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',73f6ce48-6dbc-4939-86ae-d7dfefe8520e,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2fd0489f-e4d3-40fa-9f19-b80b3b6faac9,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',1e577140-78e9-494d-aa89-2b1e0cee8817,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ad5d0e3e-5071-41c5-8bcb-33d8f5f43bb1,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e5ffbf10-53c1-4051-bcc2-fd75bce2985e,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',43460b74-4f4e-46d8-a6ae-a5005e20599c,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,057234c4-9db9-4dd9-815d-ebb0b4095610,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c81e23b1-27a1-4873-b213-08aebf842e73,NULL,c4ee3a00-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 10',12,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d7bb9da0-e571-43b4-a88a-d711e7561d72,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',803a2d51-9e7d-4fd8-b508-7ee7bdb889b6,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3d12aaa6-5acf-452a-b30f-ec3d6c4f5a5b,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',63745d40-7438-451d-889e-45977120dbf7,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e495ca51-d4e6-4224-bbe2-5dbf2e477f56,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f504d1fa-e14c-4242-bc8c-bcdeb207c400,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,c81e23b1-27a1-4873-b213-08aebf842e73,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',07430b23-cd4f-42b1-bae5-f01a8dbd5b04,NULL,c4eefd50-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 11',13,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',76d4abf3-4cb8-4c81-93bf-bdd6f36212bc,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e0020d9e-0cb1-4599-a6b6-3f66f832d035,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',5323b2b6-6d0b-404c-b7b9-412756e987b8,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',9edbbf18-2a60-4865-8c97-0d50b711ee68,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3babda70-fef8-4f32-8003-10681a432065,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',48be1fdf-0d50-495e-a3fa-f5b8b23dff72,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,07430b23-cd4f-42b1-bae5-f01a8dbd5b04,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',fcfbd51c-2c21-4531-8f18-38ec58a64556,NULL,c6445420-ea0d-11e6-8b3a-9d7cc28d7ccd,'Class 12',14,331dc52c-b36d-4c1b-a5ad-e2e402bfe485,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',bf704eb6-68ce-4b9c-a6fb-9b456c7e4a59,NULL,1cad8910-ea10-11e6-8b3a-9d7cc28d7ccd,'Section A',0,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c5cbc6ec-1654-4583-a761-00ac1e758898,NULL,1caf84e0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section B',1,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',13d11000-be79-44b8-ab94-bff9eb39a685,NULL,1d1105d0-ea10-11e6-8b3a-9d7cc28d7ccd,'Section C',2,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',143ffa2d-3807-43ba-9f5c-8e6a0e31a008,NULL,a7358e20-ea10-11e6-8b3a-9d7cc28d7ccd,'Section D',3,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',54da82d7-566c-435f-a293-7273d1797034,NULL,143eea70-ea11-11e6-8b3a-9d7cc28d7ccd,'Section E',4,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',947d904e-263f-4ada-9534-144785049698,NULL,0feeff02-61d7-4639-b5a5-f5f0281a4be7,'Section F',5,fcfbd51c-2c21-4531-8f18-38ec58a64556,true,NULL); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',00d8d101-b213-49fd-a155-3a6627c71cf1,NULL,c6f0e5ca-5214-45a6-897a-02e51349b08f,'Science',1,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',02811cb0-2ff2-4d36-90a0-38d7c326f700,NULL,06d70361-fe77-4001-ba7e-73c3c9025b82,'Value Education',0,fc5fe344-afc6-4b72-b00c-edd144dd85ba,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',05e3dd65-4415-4c8e-b993-532ade8b8ad6,NULL,b8d59224-1d32-4034-a25a-cbb1e4bb62e3,'Transport',6,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',0f40b6bb-6201-44be-b77d-f44aca1420fe,NULL,547bc01b-e3f1-400f-9114-68d473a45c42,'Art & Craft',14,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,NULL,e3f22e75-a3a4-4710-b978-8399919d2b3a,'Languages',8,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',27d3e4cf-6758-4bf5-ae05-da4b7eb07341,NULL,898eff0a-eb6d-416c-8454-5ac9ff50aab9,'Computer Science',0,bd18ce2a-e872-4698-b1c7-8172c8df5f26,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',27e5fe26-6274-4139-8db1-154392a24adc,NULL,b0572048-1d8e-43af-9395-fd133b1a6333,'PE',10,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',2b1a8eb6-4c19-4e8e-a7f7-1975b04526dc,NULL,f0b72aa7-1eae-45d0-bd7e-183f6c2b4b6f,'Business Studies',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',327ac37c-6f59-40ea-907a-897a9d9add90,NULL,65747622-a15c-425c-9a93-04a8a837eb53,'General Science',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',389fc5ed-5e5d-4e55-89f6-05698e82501e,NULL,69780629-759a-4a78-aa95-fa00a235d98b,'All Department',0,e3391463-6110-4324-a19f-43e4311835dc,true,'D'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',39b585ac-e65d-4a71-b7e8-202d50e50a3a,NULL,1e9ed215-6c28-4988-8ae5-38289c4ece6d,'Tamil',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3b2acf81-06d9-4ed7-989d-ef2be98722df,NULL,457b9cf2-b6c9-4a9d-adef-382f99a59707,'History & Civics',0,3b77f066-c2c3-4276-8840-f3e33cafa3f7,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',3d6fc08e-2594-43d9-8494-ed010f2a15bf,NULL,f5ac38b7-eb27-4c9d-96d9-4981bf933fd8,'Kannada',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',4506ead7-19a1-4ca0-90dc-a5ed984f7aff,NULL,6894f711-2b4d-4a14-b74b-a9c310954812,'Commerce',2,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',58cb3212-3d1b-47d1-914a-48386aad9329,NULL,2a86fe6d-641d-4e0e-8244-69cf33ab6420,'Geography',0,3b77f066-c2c3-4276-8840-f3e33cafa3f7,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6c4c1115-8dd4-4428-8afa-efe60099e800,NULL,1475dd18-1623-4fb8-9412-96f3c1aec434,'Psychology',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6f3eaae6-73b9-41e7-9b2b-b98ad1623cb6,NULL,ff9f86c5-3b56-4fcd-95cb-3448766526aa,'Mathematics',0,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',6f427c52-8beb-46f4-8c44-ed3e325d5787,NULL,8cb48d67-d9cd-42c5-bc7e-e9bfa6c48afc,'Telugu',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',78eed2a4-8014-4d7d-b0b1-4a845da7ab7a,NULL,79c697f3-8c1b-4067-a1a3-0f5aeaff55d7,'Accounts',12,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7924182a-2282-4bad-a351-9316a1431035,NULL,3749689f-7559-419a-8ff2-72d91289abda,'Chemistry',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7a086fc6-4b59-410a-9c9d-336740e03b98,NULL,e29d7da5-09ac-4cd2-9c3d-86741cf9e60f,'Administration',5,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7a5c28ab-4979-40be-8721-f72e2b002176,NULL,6fdf98f2-499a-4455-b954-a6bcb9615bf3,'Science',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',7b9b71fd-88a4-482c-bae4-1786cbfcd24b,NULL,d95b872c-1c8b-409f-ac78-61cdec25052f,'Accountancy',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',81ee6607-8d4c-4792-8dce-01bf5cdd3915,NULL,8951e892-70db-499e-abec-4d0cd306ec80,'Botany',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',89893266-01db-45e5-b028-451ba96a1d93,NULL,772702d0-69d7-46a8-9997-a6a42de4a95b,'Physical Education',0,27e5fe26-6274-4139-8db1-154392a24adc,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',8ac2a368-d077-4cd6-957e-b153f439395f,NULL,6f642d6e-69c1-49cb-ab2b-8b45cc7ac5eb,'Human Resources',4,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',92e9e8df-c878-4138-a9f9-c2679ed7c600,NULL,796a1703-9db3-4687-8c90-0be6544b66b3,'Statistics',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',a0e81bfd-63d5-4a6c-9ae7-8e0db424c748,NULL,ff42525a-9678-4dbd-9a67-798d0d80b193,'Business Math',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ab27df0b-d052-4c74-aa62-9aa3d445a770,NULL,d26aa598-d6a9-47ee-bd58-2804f9994293,'Economics',0,4506ead7-19a1-4ca0-90dc-a5ed984f7aff,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',afdf3087-721c-46c4-9cbc-749c3b426f7a,NULL,541a0469-1286-4df5-b8d5-58b291508b90,'Reception',11,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b0fac242-d100-43a9-95b8-0d627acbfb64,NULL,b0b745ba-3ead-4906-9927-84a27e7d98b2,'General Knowledge',0,fc5fe344-afc6-4b72-b00c-edd144dd85ba,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',b80f0e63-611a-4f58-b79b-0dfa8746b276,NULL,5616e9f4-c9fd-4b98-984f-69dd871deb2a,'Clerical',13,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',bd18ce2a-e872-4698-b1c7-8172c8df5f26,NULL,9fe9a42b-5aaf-4235-bf6c-aee55b59f8cb,'Computer Science',9,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c249e337-6c9e-4adc-8251-bcca5e6d378c,NULL,02a8f88c-0289-4aa1-83fb-4dfdd0ff3ef1,'Biology',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c4ad211f-9fc4-4d42-9761-f36b079e711f,NULL,0c37b823-a816-47c8-84cd-6a56eed0fca4,'Political Science',0,3b77f066-c2c3-4276-8840-f3e33cafa3f7,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',c9634f44-d908-4449-abb5-ba46146c9e7b,NULL,b530df57-6091-4f64-8878-6301af6d8935,'Social Science',0,3b77f066-c2c3-4276-8840-f3e33cafa3f7,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d33140ce-23b8-42a0-b23a-32beb8a4041b,NULL,f8ad6611-638a-4038-951a-60c57b71cb2f,'Mathematics',0,6f3eaae6-73b9-41e7-9b2b-b98ad1623cb6,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d46f53d2-f307-445f-8259-16f7836f2bfe,NULL,f27fc2e8-a4fd-4f6a-96fb-940f9ec6e526,'Humanities',3,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',d95cbd92-9ef9-4fe2-96ea-844e72609c05,NULL,374bea7f-a5f3-4f33-9bdc-f8a0e63a4fc2,'Newspaper In Education',0,fc5fe344-afc6-4b72-b00c-edd144dd85ba,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',dc605e1a-a9c5-40e9-959b-fb8ef21fa5c6,NULL,2c118733-4a4d-4ed2-840d-2fb3563bc2a2,'Work Experience',0,fc5fe344-afc6-4b72-b00c-edd144dd85ba,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',df8e3ab8-9900-470c-91a9-ae0be953f189,NULL,2e669955-8a45-471f-9e0b-bcd00908c09f,'Malayalam',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',e957a7f9-13ab-4261-b1ce-ab1384ab197c,NULL,3a85c4d4-4416-4c86-8667-66ec17c08270,'Hindi',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',ea97aa5b-da4a-4222-bf92-5541f154b82c,NULL,572b76d2-15fd-4ec1-97f7-897eb0fd2a34,'English',0,217e5cbd-8c2f-49e7-8450-0bfc07ed4bc1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',f6a15dc3-a929-42a2-9d61-e4583d56cdfe,NULL,9027e455-e4c0-49d6-8324-2eb346f85243,'Physics',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',fa015f1b-ddf4-4373-9341-537dd3ce46d1,NULL,007f840c-b971-4d89-920f-cbc5da73c8d8,'Zoology',0,00d8d101-b213-49fd-a155-3a6627c71cf1,true,'O'); INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,type) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,'2018-2019',fc5fe344-afc6-4b72-b00c-edd144dd85ba,NULL,de9d88e1-a4c1-4610-b764-edf2f3e6041e,'General',15,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O');"

    var notificationTemplates = "insert into nsa.school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message, email_template_title, email_template_message, push_template_title, push_template_message, status) values (255e951e-1400-460a-88c6-f8a772455f68, 25af9881-29b6-4c2e-8f22-e5fb7b1894a9, 8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Promotions', 'Dear Parent, your ward %s studying in {class_name}  has been promoted to {promoted_class}.', 'Promotions', 'Dear Parent, your ward %s studying in {class_name}  has been promoted to {promoted_class}.', 'Promotions', 'Dear Parent, your ward %s studying in {class_name}  has been promoted to {promoted_class}.', true); insert into nsa.school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (255e951e-1400-460a-88c6-f8a772455f68, 25af9881-29b6-4c2e-8f22-e5fb7b1894a9, 8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df, 2, 'Student' , 'DePromotions','Dear Parent, your ward %s studying in {class_name} has not been promoted.', 'DePromotions','Dear Parent, your ward %s studying in {class_name} has not been promoted.', 'DePromotions','Dear Parent, your ward %s studying in {class_name} has not been promoted.', true); insert into nsa.school_feature_notification_templates(feature_id, sub_feature_id, tenant_id, school_id, actions, user_type, sms_template_title, sms_template_message,email_template_title, email_template_message, push_template_title, push_template_message, status) values (255e951e-1400-460a-88c6-f8a772455f68, f9d46af8-f152-11e7-8c3f-9a214cf093ae, 8eb846a0-4549-11e7-9543-276f818a8422,cec6df10-445a-49d5-80ad-94b817b994df, 1, 'Student', 'Shuffle', 'Dear Parent, your ward %s who has been promoted to {class_name} has been placed in {section_name}.', 'Shuffle', 'Dear Parent, your ward %s who has been promoted to {class_name} has been placed in {section_name}.', 'Shuffle', 'Dear Parent, your ward %s who has been promoted to {class_name} has been placed in {section_name}.', true);"

    var leaveType = "insert into nsa.school_leave_type (leave_type_id, leave_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,days) VALUES (a3dd93cd-31e5-4691-b9a4-c842eaa5f02d, 'Sick Leave', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),3); insert into nsa.school_leave_type (leave_type_id, leave_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,days) VALUES (b467017e-43f0-4987-9ecd-38ecd46e6361, 'Causual Leave', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),3); insert into nsa.school_leave_type (leave_type_id, leave_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,days) VALUES (18cd1230-74f7-4725-90d8-e472cf0b9fbb, 'Emergency Leave', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),6); insert into nsa.school_leave_type (leave_type_id, leave_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,days) VALUES (f96c2082-fe80-4a44-bd6a-5d0b938e3983, 'Maternity Leave', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),5); insert into nsa.school_leave_type (leave_type_id, leave_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,days) VALUES (b0c2425b-2ae7-491f-a2e2-702730ab4bd7, 'Privilege Leave', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),2);"
    var assignmentType = "insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (f8ebe2db-ba02-4f5c-b270-af4b90aa2aba, 'Reading', 'Reading HW',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (10eb3812-97c8-46ff-9254-f76ac0b766cf, 'Writing', 'Writing HW',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (4314f28a-326e-460d-bf0a-6d91f03dec44, 'Seminar', 'Class Presentation', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (9495f6e3-2474-4bd0-934a-8b0184e80e96, 'Worksheets', 'Workbook', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (208afe99-bd86-4247-b021-a4271e5e7a4e, 'Presentation', 'PPT', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (359d0788-2172-4a9e-a54b-d9379c268449, 'Quiz', 'Competition', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (0ea99aed-91ab-4caf-9f05-4d6f7c8995dc, 'Lab', 'Lab HW', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (b2f2ea7e-6359-455a-b55c-8149ef29fc15, 'Practical', 'Practicals HW', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (94e18eb4-63bf-496c-96a4-640a795bb74f, 'Imposition', 'Test Remarks', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (13c6befe-a418-4246-905d-2a0ec9b21ed4 , 'Project', 'Mini project', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true); insert into nsa.school_assignment_type (assignment_type_id, assignment_type_name, assignment_desc, tenant_id, school_id, updated_by, updated_username, updated_date,status) VALUES (c18a5430-1be0-4dd9-b52a-8b537ab792e7, 'Class Test', 'Class Assessmnets',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),true);"

    var eventType = "insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (d74678d5-0f4f-4759-9a92-f18f47b6dd5b, 'Culturals',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (e43109aa-c3c8-4580-b7d7-3c66886a6aef, 'Sports',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (372b7e31-8ed3-4691-863d-bccb45f9a304, 'Literary',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (93a3058b-bcde-478f-a93e-20a085823619, 'Academics',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (7f7f473e-c0cd-442f-8faf-b04b620de203, 'Computers',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (8df9bfa1-720f-4f89-b535-4caa677cee4c , 'Music & Dance',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (e230c2b3-e5a4-4598-a884-b4bd805348df, 'Non Academics',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_event_type(event_type_id, event_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (dc5e4306-b748-4cc4-93d4-facbc5edcab1, 'Other',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()));"

    var schoolHoliday = "insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (d0284f97-be2a-4753-a7c9-5ca50484c6d5, 'National Holidays','NH',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()), '2018-2019'); insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (eb8cf80a-e4b9-481f-97d5-cf017074f409, 'School Holidays','SH',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()), '2018-2019'); insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (4d61a7eb-09d0-4d8f-9ae4-aa50ea02b991, 'Vacations','VC',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()), '2018-2019'); insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (b638d17e-3539-4b32-b036-557acd1e618f, 'Emergency Leaves','EL',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()), '2018-2019'); insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (c88c2650-f5ce-476b-a99d-eaefa5da787f, 'Study Holidays','SH',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()), '2018-2019');"

    var feeType = "insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(d0c2a3c7-bcca-4bdd-b8ae-e80378aad42b, 'ADMISSION FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(113c6c18-ef28-42f4-95c3-7491aaea86dc, 'BOOK FEE ', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(9f01444b-0f1d-4f8b-a59d-aa8fdd4a20aa, 'UNIFORM FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(a8c7bdc1-61a8-4652-8850-1bc03276b4b9, 'TUITION FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(508807d8-76b1-499f-b179-519b67df1f5d, 'APPLICATION FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(e85589f0-711b-46dc-944c-a8877893f490, 'TRANSPORT FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(74d07e1e-1dc8-4f80-8a53-b3627a620d33, 'MESS FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false); insert into nsa.school_fee_type (fee_type_id , fee_type_name, tenant_id, school_id, updated_by, updated_username, updated_date,deposit) VALUES(d1180ca5-4114-4b27-8819-3f0647151441, 'SPORTS FEE', 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()),false);"

    var activityType = "insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now())); insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Subject Enrichment Activity',8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'Admin', 'Admin', toTimeStamp(now()));"

    var roleType = "INSERT INTO nsa.school_role_type (tenant_id,school_id,id,created_by,created_date,created_firstname,description,name,updated_by,updated_date,updated_username, default_value, is_enable) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',NULL,'SchoolAdmin','Admin',toTimestamp(now()),'Admin', true, true); INSERT INTO nsa.school_role_type (tenant_id,school_id,id,created_by,created_date,created_firstname,description,name,updated_by,updated_date,updated_username, default_value, is_enable) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,ee8c7870-ea2d-11e6-8c28-a5aa0f6b308f,'Admin',toTimestamp(now()),'Admin',NULL,'Employee','Admin',toTimestamp(now()),'Admin', true, false); INSERT INTO nsa.school_role_type (tenant_id,school_id,id,created_by,created_date,created_firstname,description,name,updated_by,updated_date,updated_username, default_value, is_enable) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,fc118a00-ea2b-11e6-8b3a-9d7cc28d7ccd,'Admin',toTimestamp(now()),'Admin',NULL,'Student','Admin',toTimestamp(now()),'Admin', true, false); INSERT INTO nsa.school_role_type (tenant_id,school_id,id,created_by,created_date,created_firstname,description,name,updated_by,updated_date,updated_username, default_value, is_enable) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df,dec10422-931b-47bc-9dce-ddd3245c4816,'Admin',toTimestamp(now()),'Admin',NULL,'Faculty Manager','Admin',toTimestamp(now()),'Admin', true, true);"

    var gradingSystem = "insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (97bb7a4b-6e17-41bd-9542-f9132210891f, d162bb5f-231c-47da-96b5-50c6a6968823, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'A1', 91, 100, 10); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (914399f2-ffed-482f-b938-f3ce57314f72, 719d4628-c75b-4af8-bfde-46c24886d544, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'A2', 81, 90, 9); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (db2f8346-15d0-4b2e-8821-c170fbc37c88, 266c753a-19e6-4c7b-9a59-58e85f030dba, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'B1', 71, 80, 8); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (752af003-163a-40ad-9e2c-a586f4b5a748, 1ce9331c-cb60-4bbc-92b9-2bc87d1dae48, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'B2', 61, 70, 7); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (3744f66e-508a-4b4d-8d34-561d87070b15, 377c9f74-e5e2-4d73-afc9-109f4fa5a2ed, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'C1', 51, 60, 6); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (6d304253-145d-4698-a0ae-5a4b175c41ac, 033f6d47-4eaa-4585-a2ac-7d7dce236cf1, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'C2', 41, 50, 5); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (83ada559-f546-4fb6-9eb6-ea3886aeaa93, 63b34c11-2265-4d58-b7ca-938667b2b200, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'D', 33, 40, 4); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (e9eb7f57-f257-4f4f-9923-52ff86141b5d, baebea5b-1b80-42d5-99c6-9b93986a8605, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'E1', 21, 32, 3); insert into nsa.school_grading_system (id, grade_id, tenant_id, school_id, grade_name, start_range, end_range, cgpa_value) values (8442a1b7-c03b-41c5-bf1a-8770a2de2b06, ee075a5c-008b-4e5e-9338-776e25b358fd, 8eb846a0-4549-11e7-9543-276f818a8422, cec6df10-445a-49d5-80ad-94b817b994df, 'E2', 0, 20, 2);"

    classDetails = classDetails.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    template = template.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    department = department.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    designation = designation.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    taxanomy = taxanomy.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    notificationTemplates = notificationTemplates.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    leaveType = leaveType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    assignmentType = assignmentType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    eventType = eventType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    schoolHoliday = schoolHoliday.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    feeType = feeType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    activityType = activityType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    roleType = roleType.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    gradingSystem = gradingSystem.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    sdata = sdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    smdata = smdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    acdata = acdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    landata = landata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    sfdata = sfdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    ssdata = ssdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    termdata = termdata.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    subData = subData.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    sfData = sfData.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    srPData = srPData.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    sAwData = sAwData.replace(/cec6df10-445a-49d5-80ad-94b817b994df/g, value.schoolId);
    var finalData = school + sdata + smdata + acdata + landata + sfdata + ssdata + termdata + subData + sfData + srPData + sAwData + classDetails + template + department + designation + taxanomy + notificationTemplates + leaveType + assignmentType + eventType + schoolHoliday + feeType + activityType + roleType + gradingSystem;
    fs.writeFile(value.schoolName.replace(/ /g, '_') +'.cql', finalData, function (err) {
        console.log('Saved!');
        callback();
    });
}, function (err) {
    console.log("ALL FINISH");
});
