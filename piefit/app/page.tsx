import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-100 dark:bg-zinc-950 font-sans p-6 text-zinc-900 dark:text-zinc-100">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight border-b-2 border-zinc-300 dark:border-zinc-800 pb-4 inline-block">
          Rotina de Treinos
        </h1>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Segunda-feira */}
        <div className="flex flex-col w-full md:w-fit bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Segunda-feira
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Rosca inclinada com halteres no banco a 45°
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Rosca direta no cabo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Crucifixo reto
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Supino inclinado com halteres
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Supino declinado com halteres
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Elevação lateral
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Elevação frontal com corda
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Desenvolvimento sentado com halteres
            </li>
          </ul>
        </div>


        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Terça-feira
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Triceps livre na barra
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Triceps testa no banco com corda
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Triceps francês no cabo com banco a 90°
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Levantamento terra com barra
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Remada unilateral com halteres
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Pulley frente com a pegada fechada
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Remada baixa no triângulo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Crucifixo inverso
            </li>
          </ul>
        </div>

        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Quarta-feira
          </h2>

          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Agachamentos frontais
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Leg press
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Cadeira flexora
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Stiff
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Cadeira extensora
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Posterior em pé/deitado
            </li>
          </ul>
        </div>

        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Sexta-feira
          </h2>

          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Abdominal infra
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Abdominal supra
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Ombro à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Peito à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Peito à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Costas à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Antebraço
            </li>
          </ul>
        </div>

        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Donmingo
          </h2>

          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Agachamento livre
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Quadríceps à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Posterior à escolha
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Glúteo
            </li>

            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Panturrilha à escolha
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
