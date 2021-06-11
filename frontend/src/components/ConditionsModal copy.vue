<template>
  <v-dialog
      max-width="500"
      v-model="dialog"
      :persistent="loadingRequest || requestSuccess"
      @click:outside="cancel"
  >
    <v-card>
      <v-card-title class="headline">
        Solicitud de turno para playas
      </v-card-title>
      <v-expand-transition>
        <div v-if="!loadingRequest && !requestResponse">
          <v-card-text >
            Usted está por solicitar un turno para ingresar a una playa de la ciudad de Concepción del Uruguay. <br>
            <br>
            Mediante la confirmación de esta acción se compromete usted así como los participantes de: <br>
            <ul>
              <li>Presentarse al turno correspondiente dentro del horario seleccionado.</li>
              <li>Realizar previamente una autoevaluación de su salud descartando tener pérdida de olfato, fiebre y/u otros síntomas relacionados al COVID-19.</li>
              <li>Portar el DNI como instrumento validador de las personas que participarán al turno.</li>
              <li>En caso de ir en un vehículo motorizado, que este corresponda al indicado en el primer apartado del registro.</li>
            </ul>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                color="green darken-1"
                text
                @click="agreeConditions"
            >
              Acepto los términos
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                @click="cancel"
            >
              Cancelar
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
          <template v-if="!requestWithError">
            <v-icon color="green" style="font-size: 90px">
              mdi-check-circle-outline
            </v-icon>
            <h2 class="my-4">Datos de tu turno</h2>
            <p>
              Código: <b>{{requestResponse.data.code}}</b>
            </p>
            <p>
              Lugar: <b>{{requestResponse.data.place}}</b>
            </p>
            <p>
              Fecha: <b>{{requestResponse.data.date}}</b>
            </p>
          </template>
          <template v-else>
            <v-icon color="red" style="font-size: 90px">
              mdi-close-circle-outline
            </v-icon>
            <h2 class="my-4">Ocurrió un error</h2>
            <p>
              Mensaje: <b>{{ errorResponseText }}</b>
            </p>
          </template>
          <br>
          <v-btn color="blue-grey" class="white--text mb-6" @click="closeDialog" large v-if="requestResponse && !loadingRequest">Cerrar</v-btn>
          <br>
        </div>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConditionsModal",
  data:() => ({
    dialog:false,
    loadingRequest:false,
    requestResponse:null,
    requestWithError:false,
    requestSuccess:false
  }),
  methods:{
    showDialog(){
      this.dialog = true
    },
    agreeConditions(){
      this.$emit('agree-conditions')
      this.loadingRequest = true
      this.requestResponse = null
      this.requestWithError = false

    },
    doneRequest(requestResponse){
      setTimeout(() => {
        this.requestSuccess = true
        this.loadingRequest = false
        this.requestResponse = requestResponse
      },4000)

    },
    rejectRequest(requestResponse){
      this.loadingRequest = false
      this.requestResponse = requestResponse
      this.requestWithError = true
    },
    cancel(){
      if (this.requestSuccess || this.loadingRequest){
        return
      }
      this.closeDialog()
    },
    closeDialog(){
      if (this.requestWithError || (!this.loadingRequest && !this.requestSuccess)){
        this.requestResponse = null;
        this.dialog = false;
        this.requestWithError = false;
      }else if (this.requestSuccess) {
        window.location.reload()
      }
    }
  },
  computed:{
    errorResponseText(){
      if (this.requestResponse && this.requestResponse.response && this.requestResponse.response.data) {
        switch (typeof this.requestResponse.response.data.message) {
          case "object":
            return this.requestResponse.response.data.message[0];

          case "string":
            return this.requestResponse.response.data.message

        }
      }
      return '';
    }
  }
}
</script>
