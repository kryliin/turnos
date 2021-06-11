<template>
  <div>
    <v-row>
      <v-col cols="12" class="mx-auto">
        <p style="font-family: 'Nunito' !important; text-shadow: 1px 1px 2px black;"
            class="display-1 white--text font-weight-bold text-center mb-0 mx-auto">Estas son nuestras playas</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-container class="px-0">
          <v-row v-for="(place,index) in places">
            <v-col cols="12" md="12" lg="8" offset="0" offset-lg="2">
              <PlacePreview :card-text="place.text"
                            :image-url="place.imageURL"
                            :card-title="place.title"
                            :reverse="index % 2 == 0"/>
            </v-col>
          </v-row>
        </v-container>
        <div>
          <div style="position:absolute; margin: 0; left: 0">
            <v-container fluid class="absolute pa-0" style="left: 0; width: 100vw">
              <v-col cols="12" class="blue-bar d-flex flex-wrap justify-center">
                <img style="max-height:70px" class="ma-3" contain src="../assets/1-logo-arg.png"></img>
                <img style="max-height:70px" class="ma-3" contain src="../assets/2-logo-tur.png"></img>
                <img style="max-height:70px" class="ma-3" contain src="../assets/3-logo-cft.png"></img>
                <img style="max-height:70px" class="ma-3" contain src="../assets/4-logo-cdu.png"></img>
              </v-col>
            </v-container>
            <v-container class="pa-0">
              <v-col cols="12">
                <v-img class="mx-auto" src="../assets/flyer.jpg" max-width="300px"></v-img>
              </v-col>
            </v-container>
            <br><br>
            <v-container>
              <p class="headline">
                ¿Necesitás información personalizada?
              </p>
              <p class="title">
                Comunicate con la oficina de turismo de la ciudad
              </p>
              <v-row justify="center">
                <v-col cols="12" sm="4" md="4" lg="3" v-for="card in cards">
                  <v-card max-width="400px" flat height="100%" class="mx-auto">
                    <v-card-title class="pb-2">
                      <v-icon class="mx-auto mt-3 mb-0 display-2" color="grey">{{card.icon}}</v-icon>
                    </v-card-title>

                    <v-card-subtitle class="mt-4">
                      <p class="subtitle-2 grey--text text--darken-3 ">
                        {{card.text}}
                      </p>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import PlacePreview from "@/components/PlacePreview";
export default {
  name: "PlacesPreview",
  components:{
    PlacePreview
  },
  data:() => ({
    cards:[
      {
        icon:'mdi-map-marker',
        title:'Ubicación',
        text:'Gral. Galarza 617'
      },
      {
        icon:'mdi-phone',
        title: 'Teléfono',
        text:'+54 3442 425820'
      },
      {
        icon:'mdi-email',
        title:'Correo electrónico',
        text:'turismo@cdeluruguay.gov.ar'
      }
    ],
    places:[
      {
        imageURL:'paso-vera.jpg',
        text: 'Playa natural de finas arenas blancas al norte de “Banco Pelay”, posee una abundante vegetación autóctona y por esa característica es considerada área natural protegida.\n' +
                'Este balneario, parte integrante del nacionalmente Banco Pelay, permaneció virgen hasta el año 2002, en que comenzó a ser explotada con un criterio conservacionista, tratando de preservar su abundante y frondosa vegetación.\n' +
                'En la actualidad cuenta con todos los servicios tanto para pasar un día de playa como para acampar y pasar unos días de descanso en contacto con la naturaleza y el agua.\n' +
                'Además de su vegetación, Paso Vera se destaca por las características de su arena, suave y dorada, que se extiende por varios metros hasta hundirse en el río Uruguay.',
        title: 'Paso Vera',
      },
      {
        imageURL:'isla.jpg',
        text: 'Playa ubicada sobre el Río Uruguay, generada con uno de los usos turísticos de la Costanera Isla del Puerto\n' +
                'Este nuevo balneario cuenta con todos los servicios para pasar un día al aire libre. 2 paradores con restaurante, 2 kioscos, 3 cuerpos de sanitarios, estacionamiento y durante la temporada de verano, guardavidas. \n Acceso gratuito.',
        title: 'Isla del Puerto',
      },
      {
        imageURL: 'pelay.jpg',
        text: 'Ubicado a 10 minutos del centro de la ciudad, sobre el río Uruguay\n' +
                'Extensa playa sobre el Río Uruguay bordeada de una abundante vegetación, posee camping con todos los servicios.\n' +
                'Es el balneario más famoso y popular de la región, se puede llegar a el cruzando el arroyo Molino por un puente, y a través de un camino totalmente asfaltado hasta la playa.\n' +
                'Ubicado sobre la ribera oeste del río Uruguay este balneario espera al turista con todos los servicios necesarios. \n' +
                'Con sus siete kilómetros de costa es el balneario fluvial más extenso de América Latina y cuenta con varios paradores que brindan una amplia gama de servicios, sistemas de seguridad y de emergencias médicas, guardavidas y transporte propio.\n' +
                'Las playas son de suave pendiente y arenas doradas, rodeado por una abundante vegetación que brinda su sombra para el descanso reparador y un río tranquilo que permite disfrutarlo con tranquilidad y seguridad.',
        title: 'Banco Pelay',
      },
      {
        imageURL:'itape.jpg',
        text: 'Es el tradicional balneario de la ciudad. Esta situado a la vera del riacho Itapé, de quien recibe su nombre. Es la playa más cercana al centro de la ciudad, a solo 15 cuadras de la plaza principal Francisco Ramírez.\n' +
                'En la actualidad está en proceso de puesta en valor, del cual se ha completado la nueva configuración de sus playas.\n' +
                'Balneario camping Itapé es, por sus características, uno de los sitios más tranquilos para disfrutar en familia, dónde se destaca un gran arenal que conforma su playa y su añeja y frondosa arboleda. Su nombre significa, en lengua guaraní "piedra chata".\n' +
                'Cuenta con todos los servicios necesarios para que el bañista o el campamentista puedan aprovechar al máximo su estadía en la ciudad de Concepción del Uruguay. Sanitarios, guardavidas yseguridad (en temporada), parrilleros, cantina y comedor son algunos de los servicios que ofrece el balneario.',
        title: 'Camping Itapé',
      }
    ],
    showTuristInformation:false
  })
}

</script>

<style lang="sass" scoped>
  .blue-bar
    background-color: #61abec

</style>
