<template>
  <v-dialog
      max-width="500"
      v-model="dialog"
      :persistent="loadingRequest"
      @click:outside="cancel"
  >
    <v-card>
      <v-card-title class="headline">
        Cancelar mi turno
      </v-card-title>
      <v-expand-transition>
        <div v-if="!loadingRequest && !requestResponse">
          <v-card-text >
            Para cancelar tu turno te solicitaremos el código de reserva que realizaste y tu número de documento
          </v-card-text>
          <v-container>
            <v-text-field label="Código de reserva" v-model="appointmentCode"></v-text-field>
            <v-text-field label="DNI" v-model="appointmentDocument"></v-text-field>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                color="red darken-1"
                text
                @click="cancelAppointment"
            >
              Cancelar reserva
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                @click="cancel"
            >
              Salir
            </v-btn>
          </v-card-actions>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-if="loadingRequest">
          <v-card-text class="text-center">
            Procesando tu solicitud
          </v-card-text>
          <v-progress-linear
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
          ></v-progress-linear>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-if="requestResponse" class="text-center">
          <br>
          <template v-if="requestSuccess">
            <v-icon color="green" style="font-size: 90px">
              mdi-check-circle-outline
            </v-icon>
            <h2 class="my-4" >
              ¡Tu turno fue cancelado!
            </h2>
          </template>
          <template v-else>
            <v-icon color="red" style="font-size: 90px">
              mdi-close-circle-outline
            </v-icon>
            <h2 class="my-4">
              {{requestResponse.response.data.message}}
            </h2>
          </template>
          <br>
        </div>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CancelModal",
  data:() => ({
    dialog:false,
    requestResponse:null,
    loadingRequest:false,
    appointmentCode:null,
    appointmentDocument:null
  }),
  methods:{
    showDialog(){
      this.dialog = true
    },
    cancelAppointment(){
      this.$emit('cancel-appointment',{dni:this.appointmentDocument,codigoReserva:this.appointmentCode.toUpperCase()})
      this.loadingRequest = true
    },
    doneRequest(requestRespose){
      this.loadingRequest = false
      this.requestResponse = requestRespose
    },
    cancel(){
      this.requestResponse = null
      this.dialog = false
    }
  },
  computed:{
    requestSuccess(){
      return !!this.requestResponse && [200,201].includes(this.requestResponse.status)
    }
  }
}
</script>
