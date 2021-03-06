import assert from 'power-assert'
import Vue from 'vue'
import plugin from '../../src/index'


describe('i18n', () => {
  const locales = {
    en: {
      message: {
        hello: 'the world',
        hoge: 'hoge',
        format: {
          named: 'Hello {name}, how are you?',
          list: 'Hello {0}, how are you?'
        }
      },
      'hello world': 'Hello World',
      'Hello {0}': 'Hello {0}'
    },
    ja: {
      message: {
        hello: 'ザ・ワールド',
        hoge: 'ほげ',
        format: {
          named: 'こんにちは {name}, ごきげんいかが？',
          list: 'こんにちは {0}, ごきげんいかが？'
        }
      }
    }
  }

  before(() => {
    Vue.use(plugin, {
      lang: 'en',
      locales: locales
    })
  })


  describe('Vue.t', () => {
    describe('en language locale', () => {
      it('should translate an english', () => {
        assert(Vue.t('message.hello') === locales.en.message.hello)
      })
    })

    describe('ja language locale', () => {
      it('should translate a japanese', () => {
        assert(Vue.t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('key argument', () => {
      describe('not specify', () => {
        it('should return empty string', () => {
          assert(Vue.t() === '')
        })
      })

      describe('empty string', () => {
        it('should return empty string', () => {
          assert(Vue.t('') === '')
        })
      })

      describe('not regist key', () => {
        it('should return key string', () => {
          assert(Vue.t('foo.bar') === 'foo.bar')
        })
      })

      describe('sentence fragment', () => {
        it('should translate fragment', () => {
          assert(Vue.t('hello world') === 'Hello World')
        })

        it('should return replaced string if available', () => {
          assert(
            Vue.t('Hello {0}', ['kazupon']),
            'Hello kazupon'
          )
        })

        it('should return key if unavailable', () => {
          assert(Vue.t('Hello') === 'Hello')
        })
      })
    })

    describe('format arguments', () => {
      context('named', () => {
        it('should return replaced string', () => {
          assert(
            Vue.t('message.format.named', { name: 'kazupon' }),
            'Hello kazupon, how are you?'
          )
        })
      })

      context('list', () => {
        it('should return replaced string', () => {
          assert(
            Vue.t('message.format.list', ['kazupon']),
            'Hello kazupon, how are you?'
          )
        })
      })
    })

    describe('language argument', () => {
      it('should return empty string', () => {
        assert(Vue.t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('format & language arguments', () => {
      it('should return replaced string', () => {
        assert(
          Vue.t('message.format.list', 'ja', ['kazupon']),
          'こんにちは kazupon, ごきげんいかが？'
        )
      })
    })
  })


  describe('$t', () => {
    describe('en language locale', () => {
      it('should translate an english', () => {
        let vm = new Vue()
        assert(vm.$t('message.hello') === locales.en.message.hello)
      })
    })

    describe('ja language locale', () => {
      it('should translate a japanese', () => {
        let vm = new Vue()
        assert(vm.$t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('key argument', () => {
      describe('not specify', () => {
        it('should return empty string', () => {
          let vm = new Vue()
          assert(vm.$t() === '')
        })
      })

      describe('empty string', () => {
        it('should return empty string', () => {
          let vm = new Vue()
          assert(vm.$t('') === '')
        })
      })

      describe('not regist key', () => {
        it('should return key string', () => {
          let vm = new Vue()
          assert(vm.$t('foo.bar') === 'foo.bar')
        })
      })

      describe('sentence fragment', () => {
        it('should translate fragment', () => {
          let vm = new Vue()
          assert(vm.$t('hello world') === 'Hello World')
        })

        it('should return replaced string if available', () => {
          let vm = new Vue()
          assert(
            vm.$t('Hello {0}', ['kazupon']),
            'Hello kazupon'
          )
        })

        it('should return key if unavailable', () => {
          let vm = new Vue()
          assert(vm.$t('Hello') === 'Hello')
        })
      })
    })

    describe('format arguments', () => {
      context('named', () => {
        it('should return replaced string', () => {
          let vm = new Vue()
          assert(
            vm.$t('message.format.named', { name: 'kazupon' }),
            'Hello kazupon, how are you?'
          )
        })
      })

      context('list', () => {
        it('should return replaced string', () => {
          let vm = new Vue()
          assert(
            vm.$t('message.format.list', ['kazupon']),
            'Hello kazupon, how are you?'
          )
        })
      })
    })

    describe('language argument', () => {
      it('should return empty string', () => {
        let vm = new Vue()
        assert(vm.$t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('format & language arguments', () => {
      it('should return replaced string', () => {
        let vm = new Vue()
        assert(
          vm.$t('message.format.list', 'ja', ['kazupon']),
          'こんにちは kazupon, ごきげんいかが？'
        )
      })
    })
  })


  describe('reactive translation', () => {
    it('should translate', (done) => {
      const ViewModel = Vue.extend({
        template: '<div><p>{{ $t("message.hello", lang) }}</p></div>',
        data: () => {
          return { lang: 'en' }
        },
        el: () => {
          let el = document.createElement('div')
          el.id = 'translate-reactive'
          document.body.appendChild(el)
          return el
        }
      })

      let vm = new ViewModel()
      let el = document.querySelector('#translate-reactive')
      Vue.nextTick(() => {
        assert(el.textContent === locales.en.message.hello)

        vm.$set('lang', 'ja') // set japanese
        Vue.nextTick(() => {
          assert(el.textContent === locales.ja.message.hello)
          done()
        })
      })
    })
  })


  describe('translate component', () => {
    it('should translate', (done) => {
      const ViewModel = Vue.extend({
        template: '<div><p>{{ $t("message.hello") }}</p><hoge></hoge></div>',
        el: () => {
          let el = document.createElement('div')
          el.id = 'translate-parent'
          document.body.appendChild(el)
          return el
        },
        components: {
          hoge: {
            template: '<p id="translate-child">{{* $t("message.hoge") }}</p>'
          }
        }
      })
      new ViewModel()

      Vue.nextTick(() => {
        let child_el = document.querySelector('#translate-child')
        assert(child_el.textContent === locales.en.message.hoge)

        let parent_el = document.querySelector('#translate-parent p')
        assert(parent_el.textContent === locales.en.message.hello)

        done()
      })
    })
  })


  describe('global lang config', () => {
    let vm
    beforeEach(() => {
      vm = new Vue()
    })

    context('ja', () => {
      it('should translate with japanese', () => {
        Vue.config.lang = 'ja'
        assert(vm.$t('message.hello') === locales.ja.message.hello)
      })

      context('en', () => {
        it('should translate with english', () => {
          Vue.config.lang = 'en'
          assert(vm.$t('message.hello') === locales.en.message.hello)
        })
      })
    })
  })
})
