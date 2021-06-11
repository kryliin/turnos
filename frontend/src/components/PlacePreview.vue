<template>
  <v-card rounded raised max-width="90vw" class="mx-auto">
    <v-container>
      <v-row :class="reverse && 'flex-md-row-reverse flex-column'">
        <v-col md="4" sm="12">
          <p class="title">
            {{cardTitle}}
          </p>
          <p :class="reverse ? 'text-md-right text-center pr-4' : 'text-md-left text-center pl-4'">
            {{showLongText ? cardText : shorted(cardText)}}{{(cardText.length > textLengthLimit && !showLongText) ? '...' : '' }}
          </p>
          <div :class="reverse ? 'text-md-right text-center pr-4' : 'text-md-left text-center pl-4'">
            <v-btn
                    small
                    rounded
                    depressed
                    @click="showLongText = !showLongText"
                    v-if="cardText.length > textLengthLimit">
              Ver {{showLongText ? 'menos' : 'más'}}
            </v-btn>
          </div>
        </v-col>
        <v-col md="8" sm="12">
          <v-img v-if="imageUrl" max-height="400px" width="100%" eager :src="require('../assets/' + imageUrl)"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
name: "PlacePreview",
  props:{
    imageUrl:{
      required:true,
      type:String
    },
    cardText:{
      required:true,
      type:String
    },
    cardTitle:{
      required:true,
      type:String
    },
    reverse:{
      type:Boolean,
      default:false
    }
  },
  data:() => ({
    showLongText:false,
    textLengthLimit:400,
  }),
  methods:{
    shorted(text){
      return text.substr(0,this.textLengthLimit)
    }
  }

}
</script>

<style scoped>

</style>
