function verifierDonneesAnormales(feu) {
  // Vérifier si le serveur est en cours d'arrêt
  if (isShuttingDown) return null;

  // Incrémenter le compteur
  compteurVerifications++;
  const idVerification = compteurVerifications;

  console.log(`[DEBUG-${idVerification}] DÉBUT vérification pour le feu: ${feu.id || feu.ID}`);
  console.log(`[DEBUG-${idVerification}] Propriétés disponibles: ${Object.keys(feu).join(', ')}`);

  const feuId = feu.id || feu.ID;

  // Afficher l'état actuel de la map des anomalies
  console.log(`[DEBUG-${idVerification}] État actuel des anomalies signalées:`);
  for (const [id, anomalies] of anomaliesSignalees.entries()) {
    console.log(`[DEBUG-${idVerification}]   - Feu ${id}: ${[...anomalies].join(', ')}`);
  }

  // Créer un ensemble d'anomalies courantes
  const anomaliesCourantes = new Set();

  // Vérifier les différents types d'anomalies
  if ((feu.tension_service && feu.tension_service.includes('5V')) ||
      (feu.Tension_service && feu.Tension_service.includes('5V'))) {
    anomaliesCourantes.add("tension");
    console.log(`[DEBUG-${idVerification}] Anomalie de tension détectée: ${feu.tension_service || feu.Tension_service}`);
  }

  if ((feu.optiqueCentre === 'NOK') ||
      (feu.optiqueHaut === 'NOK') ||
      (feu.optiqueBas === 'NOK') ||
      (feu.Etat_optique_central === 'NOK') ||
      (feu.Etat_optique_haut === 'NOK') ||
      (feu.Etat_optique_bas === 'NOK')) {
    anomaliesCourantes.add("optique");
    console.log(`[DEBUG-${idVerification}] Anomalie optique détectée: optiqueCentre=${feu.optiqueCentre}, optiqueHaut=${feu.optiqueHaut}, optiqueBas=${feu.optiqueBas}`);
  }

  const autonomie = feu.autonomie || feu.Autonomie;
  if (autonomie && autonomie.includes('h')) {
    const heures = parseInt(autonomie);
    if (!isNaN(heures) && heures < 5) {
      anomaliesCourantes.add("autonomie");
      console.log(`[DEBUG-${idVerification}] Autonomie critique détectée: ${autonomie}`);
    }
  }

  console.log(`[DEBUG-${idVerification}] Anomalies courantes: ${[...anomaliesCourantes].join(', ') || 'aucune'}`);

  // Obtenir les anomalies précédentes (si elles existent)
  const anomaliesPrecedentes = anomaliesSignalees.get(feuId) || new Set();
  console.log(`[DEBUG-${idVerification}] Anomalies précédentes: ${[...anomaliesPrecedentes].join(', ') || 'aucune'}`);

  // Déterminer les nouvelles anomalies
  const nouvellesAnomalies = new Set(
    [...anomaliesCourantes].filter(type => !anomaliesPrecedentes.has(type))
  );
  console.log(`[DEBUG-${idVerification}] Nouvelles anomalies: ${[...nouvellesAnomalies].join(', ') || 'aucune'}`);

  // Déterminer les anomalies résolues
  const anomaliesResolues = new Set(
    [...anomaliesPrecedentes].filter(type => !anomaliesCourantes.has(type))
  );
  console.log(`[DEBUG-${idVerification}] Anomalies résolues: ${[...anomaliesResolues].join(', ') || 'aucune'}`);

  // Variable pour suivre si un email a été envoyé
  let emailEnvoye = false;

  // Si nous avons de nouvelles anomalies, envoyer un email
  if (nouvellesAnomalies.size > 0) {
    // Construire le message d'anomalie
    const messages = [];
    if (nouvellesAnomalies.has("tension")) {
      messages.push("Tension de service anormale: " + (feu.tension_service || feu.Tension_service));
    }
    if (nouvellesAnomalies.has("optique")) {
      messages.push("État optique défectueux détecté");
    }
    if (nouvellesAnomalies.has("autonomie")) {
      messages.push("Autonomie critique: " + (feu.autonomie || feu.Autonomie));
    }

    const messageAnomalie = messages.join(", ");
    console.log(`[DEBUG-${idVerification}] ALERTE! Nouvelles anomalies pour ${feuId}: ${messageAnomalie}`);

    // Incrémenter le compteur d'emails
    compteurEmails++;
    console.log(`[DEBUG-${idVerification}] Préparation de l'envoi d'email #${compteurEmails} pour ${feuId}`);

    try {
      // Envoyer l'alerte par email
      envoyerAlerte(feu, messageAnomalie);
      emailEnvoye = true;
      console.log(`[DEBUG-${idVerification}] Email #${compteurEmails} envoyé avec succès pour ${feuId}`);
    } catch (error) {
      console.error(`[DEBUG-${idVerification}] ERREUR lors de l'envoi de l'email: ${error.message}`);
    }

    // Envoyer l'alerte au frontend
    try {
      io.emit('feu_anomalie', {
        id: feuId,
        type: 'anomalie',
        message: messageAnomalie,
        details: feu,
        timestamp: new Date().toISOString()
      });
      console.log(`[DEBUG-${idVerification}] Notification frontend envoyée pour ${feuId}`);
    } catch (error) {
      console.error(`[DEBUG-${idVerification}] ERREUR lors de l'envoi de la notification: ${error.message}`);
    }
  }

  // Si nous avons des anomalies résolues, envoyer une notification
  if (anomaliesResolues.size > 0) {
    // Construire le message de résolution
    const messages = [];
    if (anomaliesResolues.has("tension")) {
      messages.push("Tension de service normalisée");
    }
    if (anomaliesResolues.has("optique")) {
      messages.push("État optique rétabli");
    }
    if (anomaliesResolues.has("autonomie")) {
      messages.push("Autonomie rétablie");
    }

    const messageResolution = messages.join(", ");
    console.log(`[DEBUG-${idVerification}] RÉSOLUTION! Anomalies résolues pour ${feuId}: ${messageResolution}`);

    // Envoyer la notification au frontend
    try {
      io.emit('feu_resolution', {
        id: feuId,
        type: 'resolution',
        message: messageResolution,
        details: feu,
        timestamp: new Date().toISOString()
      });
      console.log(`[DEBUG-${idVerification}] Notification de résolution envoyée pour ${feuId}`);
    } catch (error) {
      console.error(`[DEBUG-${idVerification}] ERREUR lors de l'envoi de la notification de résolution: ${error.message}`);
    }

    // Option: Envoyer un email de résolution
    // envoyerNotificationResolution(feu, messageResolution);
  }

  // Mettre à jour les anomalies SIGNALÉES
  if (anomaliesCourantes.size > 0) {
    anomaliesSignalees.set(feuId, anomaliesCourantes);
    console.log(`[DEBUG-${idVerification}] Mise à jour des anomalies connues pour ${feuId}: ${[...anomaliesCourantes].join(', ')}`);
  } else if (anomaliesPrecedentes.size > 0) {
    // Si plus d'anomalies, supprimer l'entrée
    anomaliesSignalees.delete(feuId);
    console.log(`[DEBUG-${idVerification}] Suppression de ${feuId} de la liste des anomalies connues`);
  }

  console.log(`[DEBUG-${idVerification}] FIN vérification pour ${feuId}`);

  // Retourner un objet avec plus d'informations pour permettre au code appelant
  // de savoir si un email a déjà été envoyé
  if (anomaliesCourantes.size > 0) {
    return {
      message: "Anomalies: " + [...anomaliesCourantes].join(", "),
      emailEnvoye: emailEnvoye,
      nouvellesAnomalies: [...nouvellesAnomalies],
      anomaliesResolues: [...anomaliesResolues]
    };
  } else {
    return null;
  }
}
