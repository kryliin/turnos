<template>
  <v-container class="fill-height">
    <template v-if="showIntro">
      <v-row class="text-center">
        <v-col cols="12">
          <div class="text-intro d-flex align-center justify-center"
               :class="showPlacePreview && 'resized'">
            <div>
              <div>
                <img src="../assets/logo-mcu-azul.png"
                       :class="hideThis ? 'zoom-out delay-1' : 'animated-img first'"
                       class="display-1 index-logo"
                       />
              </div>
              <p id="intro-playas-1"
                 style="font-family: 'Nunito' !important;"
                 :class="hideThis ? 'throw-up delay-1' : 'animated first'"
                 class="display-1 font-weight-bold">
                Reserva de turnos para playas
              </p>
              <p id="intro-playas-2"
                 style="font-family: 'Nunito' !important;"
                 :class="hideThis ? 'throw-up delay-2' : 'animated second'"
                 class="display-3 font-weight-bold">
                Concepción del Uruguay
              </p>
              <div>
                <div>
                  <v-btn @click="showForm"
                         outlined
                         rounded
                         style="text-transform: initial; font-size: 16px; background-color: rgba(255,255,255,0.8)"
                         :class="hideThis ? 'zoom-out delay-2' : 'intermitent third'"
                         class="ma-1 mt-4 pa-5">
                    Obtené tu turno
                  </v-btn>
                </div>
                <div class="mt-10">
                  <a class="link black--text cancel-link"
                     :class="hideThis ? 'zoom-out delay-2' : 'fourth'"
                     style="cursor:pointer"
                     href=""
                     @click.prevent="showCancelModal">Quiero cancelar mi turno</a>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-scale-transition origin="bottom center" >
        <PlacesPreview class="mx-auto" v-if="showPlacePreview"/>
      </v-scale-transition>
    </template>
    <TurnForm v-else></TurnForm>
    <CancelModal ref="cancelModal" @cancel-appointment="handleCancel"></CancelModal>
  </v-container>
</template>

<script>
import TurnForm from "@/components/TurnForm";
import PlacesPreview from "@/components/PlacesPreview";
import CancelModal from "@/components/CancelModal";
import {deleteReserva} from "../services/reservasService";

export default {
    name: 'Index',
    components:{
      TurnForm,
      PlacesPreview,
      CancelModal
    },
    data: () => ({
      hideThis:false,
      showIntro:true,
      showPlacePreview:false
    }),
    methods:{
      showForm(){
        this.hideThis = true;
        this.showPlacePreview = false;
        this.hideIntro()
      },
      hideIntro(){
        setTimeout(() => this.showIntro = false, 800)
      },
      showCancelModal(){
        this.$refs.cancelModal.showDialog();
      },
      handleCancel(data){
        deleteReserva(data).then( response => {
          this.$refs.cancelModal.doneRequest(response)
        }).catch( error => {
          this.$refs.cancelModal.doneRequest(error)
        })
      }
    },
    mounted() {
      setTimeout(() => {
        this.showPlacePreview = true;
      },1300)
    }
  }
</script>

<style scoped lang="sass">
  @keyframes some
    0%
      transform: translateY(60px)
      color: transparent
    80%
      transform: translateY(-5px)
    100%
      transform: translateY(0)
      color: black

  @keyframes animated-img
    0%
      transform: translateY(60px)
      opacity: 0
    80%
      transform: translateY(-5px)
    100%
      transform: translateY(0)
      opacity: 1

  @keyframes intermitent
    0%
      transform: rotate(0deg)
    2%
      transform: rotate(5deg)
    4%
      transform: rotate(-5deg)
    6%
      transform: rotate(5deg)
    8%
      transform: rotate(0deg)

  @keyframes zoomOut
    0%
      opacity: 0
      transform: scale(2)
    100%
      opacity: 1
      transform: scale(1)

  @keyframes throw-up
    0%
      opacity: 1
      transform: translateY(0px)
    100%
      opacity: 0
      transform: translateY(-100px)

  @keyframes zoom-out
    0%
      opacity: 1
    100%
      opacity: 0
      transform: scale(.1)

  .intermitent
    animation: 5s ease infinite intermitent
    animation-delay: 5s
    opacity: 0

  .animated
    animation: 1s ease normal some
    animation-fill-mode: forwards
    color: transparent

  .animated-img
    animation: 1s ease normal animated-img
    animation-fill-mode: forwards

  .first
    font-size: 30px
    animation-delay: 1s

  .second
    animation-delay: 1.2s

  .third
    animation-fill-mode: forwards, none
    animation-name: zoomOut, intermitent
    animation-duration: .4s, 5s
    animation-timing-function: ease, ease
    animation-iteration-count: 1, infinite
    animation-delay: 2s, 5s

  .fourth
    opacity: 0
    animation-fill-mode: forwards
    animation-name: zoomOut
    animation-duration: .4s
    animation-timing-function: ease
    animation-iteration-count: 1
    animation-delay: 2s
    border-width: 3px


  .throw-up
    animation-name: throw-up
    animation-duration: .3s
    animation-fill-mode: forwards
    animation-timing-function: ease-in

  .zoom-out
    animation-name: zoom-out !important
    animation-duration: .2s
    animation-fill-mode: forwards
    animation-timing-function: ease-in

  .delay-1
    animation-delay: .1s

  .delay-2
    animation-delay: .2s

  .text-intro
    align-content: center
    transition: min-height .8s ease
    min-height: 90vh
    &.resized
      min-height: 400px

  .index-logo
    margin: 0 auto 50px
    max-width: 180px
    border: 3px solid white
    opacity: 0
    animation-fill-mode: forwards
    animation-name: animated-img

</style>

