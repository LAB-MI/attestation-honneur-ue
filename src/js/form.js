import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, appendTo, createElement, simpleCreateElement } from './dom-utils'

const createTitle = () => {
  const h2 = createElement('h2', { className: 'titre-2', innerHTML: 'Remplissez en ligne votre déclaration numérique : ' })
  const p = createElement('p', { className: 'msg-info', innerHTML: 'Tous les champs sont obligatoires.' })
  return [h2, p]
}

const createFormGroup = ({
  autocomplete = false,
  autofocus = false,
  inputmode,
  label,
  max,
  min,
  maxlength,
  minlength,
  name,
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' })
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', { className: 'input-group align-items-center' })
  const inputAttrs = {
    autocomplete,
    autofocus,
    className: 'form-control',
    id: `field-${name}`,
    inputmode,
    min,
    max,
    minlength,
    maxlength,
    name,
    pattern,
    placeholder,
    required: true,
    type,
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const example = createElement('p', { className: 'exemple  basis-100' })

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)
  appendToInputGroup(example)

  return formGroup
}

export function createForm () {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)

  const formFirstPart = formData
    .flat(1)
    .filter(field => !field.isHidden)
    .map((field,
      index) => {
      const formGroup = createFormGroup({
        autofocus: index === 0,
        ...field,
        name: field.key,
      })

      return formGroup
    })

  const symptomList = [
    'de la fièvre ou des frissons,',
    'une toux ou une augmentation de ma toux habituelle,',
    'une fatigue inhabituelle,',
    'un essoufflement inhabituel quand je parle ou je fais un petit e­ffort,',
    'des douleurs musculaires et/ou des courbatures inhabituelles,',
    'des maux de tête inexpliqués,',
    'une perte de goût ou d’odorat,',
    'des diarrhées inhabituelles.',
  ]
  const createUl = simpleCreateElement('ul')
  const createLi = simpleCreateElement('li')
  const engagementSymptomList = symptomList.map((el) => createLi(el))
  const liste = createUl(...engagementSymptomList)

  const engagementPart = () => {
    const engagementSymptoms = createElement('p', { className: 'symptoms', innerHTML: '<strong>déclare sur l’honneur</strong> n’avoir présenté, au cours des dernières 48 heures, aucun des symptômes suivants :' })
    const engagementSymptomsList = liste
    const engagementContact = createElement('p', { className: 'contact', innerHTML: '<strong>déclare sur l’honneur</strong> ne pas avoir connaissance d’avoir été en contact avec un cas confirmé de covid-19 dans les quatorze jours précédant le départ ;' })
    const engagementExamBio = createElement('p', { className: 'exam-bio', innerHTML: '<strong>m’engage sur l’honneur</strong> à me soumettre à un test antigénique ou à un examen biologique éventuel à l’arrivée.' })
    return [engagementSymptoms, engagementSymptomsList, engagementContact, engagementExamBio]
  }

  appendToForm([...createTitle(), ...formFirstPart, ...engagementPart()])
}
