<template>
  <v-flex class="slide-up mt-10" align-self-start v-else xs12 sm10 offset-sm1>
    <v-row class="text-center">
      <v-card rounded width="100%" justify="center" class="mb-10" style="background-color: rgba(255,255,255,0.9)">
        <v-card-title class="d-block mt-3">
          <p class="text-center display-1" style="word-break: break-word">
            Estás por reservar un turno para asistir a la playa
          </p>
        </v-card-title>
        <v-card-subtitle class="mt-3">
          A continuación deberás completar la siguiente información para tu turno
          <br>
          Luego de completar el formulario, recibiras un código que utilizarás para ingresar al lugar de destino
        </v-card-subtitle>
        <form>
          <v-container>
            <br>
            <h3 class="text-left mx-4">Información de traslado</h3>
            <p class="text-left mx-4">
              Seleccioná la opción del medio de transporte que utilizarán para ingresar
            </p>
            <div class="d-flex">
              <v-select
                  :items="transportOptions"
                  label="Transporte"
                  item-text="name"
                  return-object
                  required
                  class="px-5 col-5"
                  @change="setTransport"
              ></v-select>
              <v-text-field
                  v-if="vehicleType && vehicleType != 'bicycle'"
                  label="Patente"
                  class="px-5 col-5"
                  id="patente"
                  v-model="vehicleIdentification"
                  :error="patenteRegexError"
              ></v-text-field>
            </div>

            <h3 class="text-left mx-4">Información del grupo</h3>
            <p class="text-left mx-4">
              Ingresá los datos de los participantes de tu grupo
            </p>
            <div v-for="(participant,index) in participants" class="d-flex flex-wrap">
              <div class="form-control col-6 col-md-3 col-sm-5">
                <v-text-field
                    v-model="participant.dni"
                    type="number"
                    label="DNI"
                    required
                    :readonly="index == 0 && firstDniValidated"
                    v-bind:error="participant.duplicated || participant.dniError"
                    @blur="checkDni(participant)"
                ></v-text-field>
              </div>
              <div class="form-control col-6 col-md-3 col-sm-4">
                <v-select
                    v-model="participant.sex"
                    :items="sexOptions"
                    label="Sexo"
                    item-disabled="disabled"
                    item-text="value"
                    :readonly="index == 0 && firstDniValidated"
                    v-bind:error="participant.duplicated"
                    required
                ></v-select>
              </div>
              <div class="form-control d-flex align-center col-1" v-if="index == 0 && !firstDniValidated">
              <v-scale-transition origin="center center">
                <v-btn v-if="!firstDniValidated && !isValidating"
                       :disabled="!canValidateParticipant || participant.dniError"
                       @click="validateParticipant"
                       small
                       class="mr-4">
                  Validar
                </v-btn>
                <v-progress-circular v-else-if="isValidating" indeterminate></v-progress-circular>
              </v-scale-transition>
              </div>
              <div class="form-control d-flex align-center col-1" v-if="index == 0 && firstDniValidated">
                <v-scale-transition origin="center center">
                  <v-btn
                         @click="firstDniValidated = false"
                         small
                         class="mr-4">
                    Cambiar
                  </v-btn>
                </v-scale-transition>
              </div>
              <div class="col-1" v-if="index > 0">
                <v-btn @click="removeParticipant(index)" icon outlined >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="d-flex justify-end">
              <v-btn small
                     class="mr-5"
                     v-if="firstDniValidated"
                     :disabled="!this.vehicleType || this.vehicleType == 'bicycle' || !canAddParticipant"
                     @click="addParticipant">
                Agregar
              </v-btn>
            </div>
            <br>
            <h3 class="text-left mx-4">Datos para contacto</h3>
            <p class="subtitle-1 mx-4 text-left">
              Utilizaremos esta información para enviarte los datos del turno que estás solicitando.
            </p>
            <div class="d-flex">
              <div class="px-5 col-10 col-md-5">
                <v-text-field
                    label="Email (recibiras los datos del turno por email)"
                    v-model="email"
                    @blur="checkEmail"
                    :error=" emailError"
                ></v-text-field>
              </div>
            </div>
            <div class="d-flex">
              <div class="px-5 col-10 col-md-5">
                <v-text-field
                    label="Teléfono"
                    v-model="phone"
                    :error="phoneNumberRegexError"
                ></v-text-field>
              </div>
            </div>
            <br>
            <h3 class="text-left mx-4">Fecha y lugar de tu turno</h3>
            <p class="subtitle-1 mx-4 text-left">
              Indicanos cuando querés asistir y a que lugar.
            </p>
            <div class="mb-7">
              <div class="d-flex flex-column flex-md-row justify-center">
                <div>
                  <v-date-picker
                      v-model="appointmentDate"
                      class="ma-4"
                      :min="todayDate"
                      :max="maxDate"
                      locale="es-es"
                      @change="getPlaceStatus"
                  ></v-date-picker>
                </div>
                <div class="col-12 col-md-6">
                  <v-radio-group row v-model="appointmentType" @change="getPlaceStatus" v-if="availableAppointments.length > 1">
                    <v-radio
                        v-for="(key,appointment) in availableAppointments"
                        :label="appointment"
                        :value="appointment"
                    ></v-radio>
                  </v-radio-group>
                  <div class="d-flex flex-wrap mt-md-0 mt-8 justify-center" style="color: #f70300; width: 100%">
                    <v-card v-for="place in places"
                            rounded
                            class="ma-2 flex-grow-1"
                            width="45%"
                            min-height="130px"
                            max-width="300px"
                            @click="selectPlace(place)"
                            :disabled="!place.canSelect"
                    >
                      <v-card-title class="subtitle-1 ellipsis-text">
                        <p>{{ place.nombre }}</p>
                      </v-card-title>
                      <v-progress-circular
                          :rotate="-90"
                          :size="60"
                          :width="10"
                          :value="place.usage"
                          :color="computedColor(place.usage)"
                      >
                        {{ place.usage }}%
                      </v-progress-circular>
                    </v-card>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div v-if="appointmentDate && placeId && this.firstDniValidated && participants.length>0">
              <h3 style="font-weight: normal">
                Estas solicitando turno en <b>{{selectedPlaceName}}</b> el día <b>{{showableDate}}</b> para <b>{{participants.length}}</b> persona{{participants.length>1 ? 's' : ''}}
              </h3>
            </div>
            <br>
            <v-tooltip top :disabled="canSubmit">
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" class="pa-4">
                  <v-btn v-bind="attrs" large class="my-6" :disabled="!canSubmit" @click="showConditions">Solicitar</v-btn>
                </span>
              </template>
              <span>
                <ul>
                  <li v-for="field in remainingFields">{{field}}</li>
                </ul>
              </span>
            </v-tooltip>
          </v-container>
          <v-container>
            <v-col cols="12">
              <div class="d-flex flex-column flex-wrap flex-sm-row align-center justify-center">
                <v-img class="mx-3 mb-3" src="../assets/manos.jpg" max-width="230px" min-width="210px" width="30%"></v-img>
                <v-img class="mx-3 mb-3" src="../assets/tapa-boca.jpg" max-width="230px" min-width="210px" width="30%"></v-img>
                <v-img class="mx-3 mb-3" src="../assets/distancia.jpg" max-width="230px" min-width="210px" width="30%"></v-img>
              </div>
            </v-col>
          </v-container>
        </form>
        <ConditionsModal ref="conditionsModal" @agree-conditions="submitForm"></ConditionsModal>
        <v-snackbar v-model="snackbarValidationError"
                    :timeout="3000"
                    color="red">
          No se pudo validar su identidad!
          <template v-slot:action="{ attrs }">
            <v-btn color="white"
                text
                v-bind="attrs"
                @click="snackbar = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </v-row>
  </v-flex>
</template>

<script>
import ConditionsModal from "@/components/ConditionsModal";
import axios from 'axios'
import {getTurnos} from "@/services/turnosService";
import {getEspacios} from "@/services/espaciosService";
import {getEstadoReservas, postReserva} from "@/services/reservasService";
import {validarPersona} from "@/services/personasService";
export default {
  name: "TurnForm",
  components:{
    ConditionsModal
  },
  data:() => ({
    participants:[
      {dni:null, sex:null, transactionId:null, dniError:false}
    ],
    sexOptions:[
        {value:'Femenino', disabled: false},
        {value:'Masculino', disabled: false}
    ],
    transportOptions:[
      {value:'car', name: 'Automovil', maxParticipants:10},
      {value:'motorbike', name: 'Motocicleta', maxParticipants:10},
      {value:'bicycle', name: 'Bicicleta', maxParticipants:1}
    ],
    places:[],
    vehicleType:null,
    maxParticipantsByVehicle:0,
    vehicleIdentification:null,
    placeId:null,
    sectorId:null,
    appointmentDate:null,
    appointmentType:null,
    firstDniValidated:false,
    isValidating:false,
    availableAppointments:[],
    maxDaysForward: 45,
    showConditionsModal:false,
    email:null,
    emailError:false,
    phone:null,
    reservationStatus:null,
    snackbarValidationError:false,
    turnsByPlace:[],
    apiToken:null,
    duplicatedDni:false
  }),
  methods:{
    addParticipant(){
      if (this.participants.length < this.maxParticipantsByVehicle){
        this.participants.push({dni:null, sex:null, dniError: false})
      }
    },
    removeParticipant(index){
      this.participants.splice(index,1);
      this.checkDuplicatedDni();
    },
    checkDni(participant){
      this.checkDuplicatedDni();
      participant.dniError = this.hasDniRegexError(participant);
    },
    setTransport(option){
      this.vehicleType = option.value
      if (option.value === 'bicycle') {
        this.vehicleIdentification = null
      }
      this.maxParticipantsByVehicle = option.maxParticipants
      while (this.participants.length > this.maxParticipantsByVehicle){
        this.participants.pop();
      }
      this.checkDuplicatedDni();
    },
    selectPlace(place){
      this.placeId = place.id
      this.sectorId = place.sector
    },
    showConditions(){
      this.$refs.conditionsModal.showDialog();
    },
    submitForm(){
      let request = {
        idEspacio: this.placeId,
        idSector: this.sectorId,
        idTurno: this.turnsByPlace.find (x => x.espacio.id === this.placeId).id,
        patente: this.vehicleIdentification,
        correo: this.email,
        telefono: this.phone,
        fechaReserva: this.appointmentDate + 'T03:00:00.000Z',
        listaDNI: this.participants.map( x => { return {
              dni : x.dni,
              numeroTramite : x.transactionId ?? 0,
              sexo : x.sex.substr(0,1)
            }
          }
        )
      }
      postReserva(request,this.apiToken)
        .then(res => {
          const processedResponse = {
            data:{
              date: this.appointmentDate.split('-').reverse().join('/'),
              place: this.places.find( x => x.id === this.placeId).nombre,
              code: res.data
            }
          }
          this.$refs.conditionsModal.doneRequest(processedResponse)
          getEstadoReservas(this.maxDaysForward).then(res => {
                    this.reservationStatus = res.data.map(x => {
                      x.fecha = x.fecha.substr(0, 10);
                      return x;
                    })
                    this.$nextTick(() => {
                      this.getPlaceStatus()
                      this.initializeForm()
                    })
                  }

          )
        }).catch(error => {
          this.$refs.conditionsModal.rejectRequest(error)
        })
    },
    getPlaceStatus(isGeneral = true, placeId = 0){
      if (this.appointmentDate && this.appointmentType){
        let dataOfDay = this.reservationStatus.find(x => x.fecha === this.appointmentDate);
        this.places.forEach( place => {
          let reservationPlaceData = dataOfDay.listaEspacios.find(reservationPlace => reservationPlace.nombre === place.nombre);
          if (reservationPlaceData){
            let placeAppointmentData = reservationPlaceData.listaTurnos.find( placeAppointment => placeAppointment.nombre === this.appointmentType)
            if (placeAppointmentData) {
              place.usage = Math.round((placeAppointmentData.cantidadReservas / placeAppointmentData.cupoMaximo)*100);
              place.canSelect = place.usage < 90;
              place.sector = reservationPlaceData.listaSectores[0].idSector;
            }else{
              // bloqueo el place
              place.usage = 0
              place.canSelect = false
            }
          }else{
            // bloqueo el place
            place.usage = 0
            place.canSelect = false
          }
        });
      }else{
        console.warn('me faltan datos')
        this.places.forEach( place => {
          place.usage = 0
          place.canSelect = false
        });
      }
    },
    computedColor(number){
      const raw = { r: number/100 , g: 1- number/100, b:0 }
      const hex = '#' + ('0'+Math.round(raw.r*255).toString(16)).slice(-2)
                      + ('0'+Math.round(raw.g*255).toString(16)).slice(-2)
                      + ('0'+Math.round(raw.b*255).toString(16)).slice(-2)
      return hex
    },
    validateParticipant(){
      this.isValidating = true;
      setTimeout( () => {
        validarPersona({
          dni:this.participants[0].dni,
          numeroTramite:this.participants[0].transactionId,
          sexo:this.participants[0].sex.substr(0,1)
        })
            .then( res => {
              if (res.data &&res.data.trim() !== ''){
                this.apiToken = res.data;
                this.firstDniValidated = true;
                this.isValidating = false;
              } else {
                this.firstDniValidated = false;
                this.isValidating = false;
                this.snackbarValidationError = true;
              }
            })
            .catch( res => {
                  this.firstDniValidated = false;
                  this.isValidating = false;
                  this.snackbarValidationError = true;
                }
            );
      },1000) //cambiar por 5
    },
    checkDuplicatedDni(){
      this.duplicatedDni = false
      if (this.participants.length > 1){
        this.participants.reduce((acc,item,index) => {
          if (acc[item.dni]){
            this.duplicatedDni = true
            this.participants[index].duplicated = true
            return acc
          }
          acc[item.dni] = 1
          this.participants[index].duplicated = false
          return acc
        },{})
      }
    },
    initializeForm(){
      this.participants = [
        {dni:null, sex:null, transactionId:null}
      ];
      this.firstDniValidated = false;
      this.vehicleType = null;
      this.vehicleIdentification = null;
      this.email = null;
      this.phone = null;
    },
    hasDniRegexError(participant){
      return !!participant &&
              participant.dni != '' &&
              participant.dni.search(/^([0-9]{7,9})$/) == -1
    },
    checkEmail(){
      this.emailError = this.emailRegexError
    }
  },
  computed:{
    canAddParticipant(){
      return this.participants.reduce( (acc,x) => { return ((x.dni && x.sex) ? 0 : 1) + acc} , 0) === 0
    },
    canSubmit(){
      return this.canAddParticipant
             && this.vehicleType
             && (this.vehicleType === 'bicycle' || this.vehicleIdentification)
             && this.placeId
             && this.appointmentDate
             && this.appointmentType
             && !this.duplicatedDni
             && !this.emailRegexError
             && !this.phoneNumberRegexError
             && !this.patenteRegexError
             && this.participants.reduce((acc,x) => {return ((x.dniError) ? 1 : 0) + acc},0) === 0
    },
    todayDate(){
      const date = new Date(Date.now() - (new Date()).getTimezoneOffset()*60000)
      return date.toISOString()
    },
    maxDate(){
      const date = new Date(Date.now() - (new Date()).getTimezoneOffset()*60000);
      return new Date(date.setDate(date.getDate() + this.maxDaysForward)).toISOString()
    },
    canValidateParticipant(){
      return this.participants[0].dni
          && this.participants[0].sex
    },
    selectedPlaceName(){
      return this.places.find( x => x.id==this.placeId).nombre
    },
    showableDate(){
      return this.appointmentDate.split('-').reverse().join('/')
    },
    emailRegexError(){
      // return !!this.email && this.email!= '' && this.email.search(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+))|(".+")*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == -1 ;
      return !!this.email && this.email!= '' && this.email.search(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) == -1 ;
    },
    patenteRegexError(){
      return this.vehicleIdentification
              && this.vehicleIdentification != ''
              && !( //try to match with car (newest or oldest) or motorbike (newest or oldest) identification
                       this.vehicleIdentification.search(/^([a-zA-Z]{2})([0-9]{3})([a-zA-Z]{2})$/) > -1 || //car new
                       this.vehicleIdentification.search(/^[a-zA-Z]([0-9]{3})([a-zA-Z]{3})$/) > -1 || //motorbike new
                       this.vehicleIdentification.search(/^([a-zA-Z]{3})([0-9]{3})$/) > -1 || //car old
                       this.vehicleIdentification.search(/^([0-9]{3})([a-zA-Z]{3})$/) > -1 //motorbike old
              )
    },

    phoneNumberRegexError(){
      return !!this.phone &&
              this.phone != '' &&
              this.phone.search(/^\+?([0-9]{10,15})$/) == -1
    },
    remainingFields(){
      let fields = [];
      (!this.canAddParticipant || !this.apiToken) && fields.push('Validar responsable o completar participantes')
      !this.vehicleType && fields.push('Seleccionar transporte')
      !(this.vehicleType === 'bicycle' || this.vehicleIdentification) && fields.push('Ingresar patente de transporte')
      !this.placeId && fields.push('Seleccionar playa')
      !this.appointmentDate && fields.push('Seleccionar fecha del turno')
      !this.appointmentType && fields.push('Seleccionar tipo de turno')
      this.duplicatedDni && fields.push('Has ingresado un DNI duplicado')
      this.emailRegexError && fields.push('El email ingresado no es correcto')
      this.phoneNumberRegexError && fields.push('El número de teléfono no es correcto')
      this.patenteRegexError && fields.push('La patente no tiene un formato correcto')
      this.participants.reduce((acc,x) => {return ((x.dniError) ? 1 : 0) + acc},0) > 0 && fields.push('Al menos un dni inválido')

      return fields
    }
  },
  mounted() {
    getTurnos().then(res => {
      let result = {}
      res.data.forEach(x => { result[x.nombre] = 1 } )
      this.turnsByPlace = res.data
      this.availableAppointments = result
      if (Object.keys(this.availableAppointments).length === 1){
        this.appointmentType = Object.keys(this.availableAppointments).shift()
      }
    }).catch(error => {
        if (!error.response) {
          // network error
          console.log('Error: Network Error') ;
        } else {
          console.log(error.response.data.message);
        }
      }
    );
    getEspacios().then(res =>{
      this.places = res.data
    });
    getEstadoReservas(this.maxDaysForward).then(res =>
      this.reservationStatus = res.data.map( x => {
        x.fecha = x.fecha.substr(0,10);
        return x;
      })
    )
  }


}
</script>

<style scoped lang="sass">
  @keyframes slide-up
    0%
      transform: translateY(100vh)
    100%
      transform: translateY(0px)

  .slide-up
    animation-name: slide-up
    animation-timing-function: ease-in-out
    animation-duration: .4s

  .ellipsis-text
    padding-left: 3px
    padding-right: 3px
    &>p
      margin-bottom: 0
      width: 100%
      text-overflow: ellipsis

  input#patente
    text-transform: uppercase

</style>
